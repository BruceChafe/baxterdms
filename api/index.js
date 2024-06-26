import dotenv from "dotenv";
import path from "path";
import express from "express";
import serverless from "serverless-http";
import multer from "multer";
import cors from "cors";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  BlobClient,
} from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import {
  uploadFileToBlobStorage,
  generateSasToken,
  deleteBlob,
  deleteDocument,
} from "../src/components/documentArchive/utilities/useBlobStorageClient.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://baxterdms.vercel.app",
  "https://www.baxterdms.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const upload = multer();

const cosmosClient = new CosmosClient(
  process.env.VITE_COSMOS_CONNECTION_STRING
);
const database = cosmosClient.database(process.env.VITE_COSMOS_DATABASE_ID);
const container = database.container(process.env.VITE_COSMOS_CONTAINER_ID);

const client = new DocumentAnalysisClient(
  process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT,
  new AzureKeyCredential(process.env.VITE_AZURE_FORM_RECOGNIZER_KEY)
);

const analyzeDocument = async (sasUrl, modelId) => {
  console.log(`Starting analysis for URL: ${sasUrl} with model: ${modelId}`);
  try {
    const poller = await client.beginAnalyzeDocument(modelId, sasUrl);
    const result = await poller.pollUntilDone();
    console.log(`Analysis complete for URL: ${sasUrl}`);
    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error during document analysis:", error.message);
    throw error;
  }
};

app.post("/api/uploadLicense", upload.single("file"), async (req, res) => {
  try {
    const { documentType, metadata } = req.body;
    if (!req.file) throw new Error("No file uploaded");
    if (!documentType) throw new Error("Document type is required");

    const containerName = "data-archive-skeezer-motors";
    const archiveBlobUrl = await uploadFileToBlobStorage(req.file, containerName);
    const archiveSasUrl = await generateSasToken(containerName, req.file.originalname);

    const analyzedDocument = await analyzeDocument(archiveSasUrl, "prebuilt-idDocument");

    if (!analyzedDocument) {
      throw new Error("Document analysis failed");
    }

    const document = {
      documentId: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      documentType,
      analysisResult: analyzedDocument,
      archiveUrl: archiveSasUrl,
    };

    const { resource: createdItem } = await container.items.create(document);
    res.status(200).send(createdItem);
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { documentType, metadata } = req.body;
    if (!req.file) throw new Error("No file uploaded");
    if (!documentType) throw new Error("Document type is required");

    const containerName = "data-archive-skeezer-motors";
    const archiveBlobUrl = await uploadFileToBlobStorage(
      req.file,
      containerName
    );
    const archiveSasUrl = await generateSasToken(
      containerName,
      req.file.originalname
    );

    res
      .status(200)
      .send({ message: "File uploaded successfully", url: archiveSasUrl });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).send({ error: error.message });
  }
});



app.post("/api/analyze", async (req, res) => {
  try {
    const { url, analyzerType } = req.body;
    if (!url) {
      return res.status(400).send({ error: "URL is required" });
    }
    if (!analyzerType) {
      return res.status(400).send({ error: "Analyzer type is required" });
    }
    const analysisResult = await analyzeDocument(url, analyzerType);
    const document = {
      documentId: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      documentType: analyzerType === "document" ? "document" : analyzerType,
      analysisResult,
      archiveUrl: url, // Store the archive URL
    };

    const { resource: createdItem } = await container.items.create(document);
    res.status(200).send(createdItem);
  } catch (error) {
    console.error("Error in document analysis:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/documents", async (req, res) => {
  try {
    const { search } = req.query;
    const querySpec = search
      ? {
          query:
            "SELECT * FROM c WHERE CONTAINS(c.metadata, @search) OR CONTAINS(c.documentType, @search)",
          parameters: [{ name: "@search", value: search }],
        }
      : { query: "SELECT * FROM c" };

    const { resources: documents } = await container.items
      .query(querySpec)
      .fetchAll();

    const documentsWithFilenames = documents.map((doc) => {
      const filename = doc.archiveUrl
        ? decodeURIComponent(doc.archiveUrl.split("/").pop().split("?")[0])
        : "Unknown";
      return {
        ...doc,
        filename,
      };
    });

    res.status(200).send(documentsWithFilenames);
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/documents/:documentId", async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const querySpec = {
      query: "SELECT * FROM c WHERE c.documentId = @documentId",
      parameters: [{ name: "@documentId", value: documentId }],
    };

    const { resources: documents } = await container.items.query(querySpec).fetchAll();

    if (documents.length === 0) {
      return res.status(404).send({ error: "Document not found" });
    }

    res.status(200).json(documents[0]);
  } catch (error) {
    console.error("Error fetching document:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.delete("/api/documents/:id", async (req, res) => {
  const documentId = req.params.id;
  try {
    console.log(`Received request to delete document with ID: ${documentId}`);

    const querySpec = {
      query: "SELECT * FROM c WHERE c.documentId = @documentId",
      parameters: [{ name: "@documentId", value: documentId }],
    };

    console.log(`Query spec: ${JSON.stringify(querySpec)}`);

    const { resources: documents } = await container.items
      .query(querySpec)
      .fetchAll();

    console.log(`Query result: ${JSON.stringify(documents)}`);

    if (documents.length === 0) {
      console.log(`Document with ID: ${documentId} not found.`);
      return res.status(404).send("Document not found");
    }

    const document = documents[0];
    const blobUrl = document.archiveUrl;
    console.log(`Retrieved Blob URL: ${blobUrl}`);
    console.log(`Document to delete: ${JSON.stringify(document)}`);

    await deleteDocument(document.documentId);
    console.log("Document deleted successfully");

    await deleteBlob(blobUrl);

    res.status(200).send("Document and blob deleted successfully");
  } catch (error) {
    console.error("Error deleting document and blob:", error.message);
    res.status(500).send("Error deleting document and blob");
  }
});

app.use(express.static(path.join(process.cwd(), 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

if (process.env.NODE_ENV !== "serverless") {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
export const handler = serverless(app);
