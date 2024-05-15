import dotenv from "dotenv";
import path from "path";
import express from "express";
import multer from "multer";
import cors from "cors";
import {
  uploadFileToBlobStorage,
  generateSasToken,
  deleteBlob,
  deleteDocument,
} from "./src/components/documentArchive/utilities/useBlobStorageClient.js";
import { CosmosClient } from "@azure/cosmos";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;
const cosmosConnectionString = process.env.COSMOS_CONNECTION_STRING;
const formRecognizerEndpoint = process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT;
const formRecognizerKey = process.env.VITE_AZURE_FORM_RECOGNIZER_KEY;
const cosmosDatabaseId = process.env.COSMOS_DATABASE_ID;
const cosmosContainerId = process.env.COSMOS_CONTAINER_ID;

if (
  !accountName ||
  !accountKey ||
  !cosmosConnectionString ||
  !formRecognizerEndpoint ||
  !formRecognizerKey ||
  !cosmosDatabaseId ||
  !cosmosContainerId
) {
  throw new Error("Some required environment variables are not defined.");
}

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

const upload = multer();

const cosmosClient = new CosmosClient(cosmosConnectionString);
const database = cosmosClient.database(cosmosDatabaseId);
const container = database.container(cosmosContainerId);

const client = new DocumentAnalysisClient(
  formRecognizerEndpoint,
  new AzureKeyCredential(formRecognizerKey)
);

const analyzeDocument = async (sasUrl) => {
  const poller = await client.beginAnalyzeDocumentFromUrl(
    "prebuilt-invoice",
    sasUrl
  );
  const { documents } = await poller.pollUntilDone();
  return documents;
};

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    const containerName = "data-archive-skeezer-motors";
    const blobUrl = await uploadFileToBlobStorage(req.file, containerName);
    const sasUrl = await generateSasToken(containerName, req.file.originalname);
    res
      .status(200)
      .send({ message: "File uploaded successfully", url: sasUrl });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).send({ error: "URL is required" });
    }
    const analysisResult = await analyzeDocument(url);
    const document = {
      documentId: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      documentType: "invoice",
      analysisResult,
      originalUrl: url,
      archivedUrl: url,
    };

    const { resource: createdItem } = await container.items.create(document);
    res.status(200).send(createdItem);
  } catch (error) {
    console.error("Error in document analysis:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.get("/documents", async (req, res) => {
  try {
    const { resources: documents } = await container.items.readAll().fetchAll();
    res.status(200).send(documents);
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    res.status(500).send({ error: error.message });
  }
});

app.delete("/documents/:id", async (req, res) => {
  const documentId = req.params.id;
  try {
    const { resources: documents } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.documentId = @documentId",
        parameters: [{ name: "@documentId", value: documentId }],
      })
      .fetchAll();

    if (documents.length === 0) {
      return res.status(404).send("Document not found");
    }

    const document = documents[0];
    const blobUrl = document.originalUrl;
    const partitionKey = document.documentId;

    await deleteDocument(document.id, partitionKey);
    await deleteBlob(blobUrl);

    res.status(200).send("Document and blob deleted successfully");
  } catch (error) {
    console.error("Error deleting document and blob:", error.message);
    res.status(500).send("Error deleting document and blob");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
