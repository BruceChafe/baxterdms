import dotenv from 'dotenv';
import path from 'path';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, BlobClient } from '@azure/storage-blob';
import { CosmosClient } from '@azure/cosmos';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import express from 'express';
import serverless from 'serverless-http';
import multer from 'multer';
import cors from 'cors';
import { uploadFileToBlobStorage, generateSasToken, deleteBlob, deleteDocument } from '../src/components/documentArchive/utilities/useBlobStorageClient.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://baxterdms.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const upload = multer();

const cosmosClient = new CosmosClient(process.env.VITE_COSMOS_CONNECTION_STRING);
const database = cosmosClient.database(process.env.VITE_COSMOS_DATABASE_ID);
const container = database.container(process.env.VITE_COSMOS_CONTAINER_ID);

const client = new DocumentAnalysisClient(
  process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT,
  new AzureKeyCredential(process.env.VITE_AZURE_FORM_RECOGNIZER_KEY)
);

const analyzeDocument = async (sasUrl, analyzerType) => {
  console.log(`Starting analysis for URL: ${sasUrl} with analyzer type: ${analyzerType}`);
  try {
    let poller;
    if (analyzerType === 'invoice') {
      poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", sasUrl);
    } else if (analyzerType === 'layout') {
      poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-layout", sasUrl);
    } else {
      poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", sasUrl);
    }

    const result = await poller.pollUntilDone();
    console.log(`Analysis complete for URL: ${sasUrl}`);
    console.log('Analysis result:', result);

    if (result.documents && result.documents.length > 0) {
      return result.documents;
    } else if (result.pages && result.pages.length > 0) {
      return result.pages;
    } else {
      console.warn('No analysis result documents or pages found.');
      return [];
    }
  } catch (error) {
    console.error('Error during document analysis:', error.message);
    throw error;
  }
};


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { documentType, metadata } = req.body;
    if (!req.file) throw new Error('No file uploaded');
    if (!documentType) throw new Error('Document type is required');

    const containerName = 'data-archive-skeezer-motors';
    const blobUrl = await uploadFileToBlobStorage(req.file, containerName);
    const sasUrl = await generateSasToken(containerName, req.file.originalname);

    // Save metadata to Cosmos DB
    const document = {
      documentId: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      documentType,
      metadata,
      analysisResult: [],
      originalUrl: sasUrl,
      archivedUrl: sasUrl,
    };

    const { resource: createdItem } = await container.items.create(document);

    res.status(200).send({ message: 'File uploaded successfully', url: sasUrl });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).send({ error: error.message });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { url, analyzerType } = req.body;
    if (!url) {
      return res.status(400).send({ error: 'URL is required' });
    }
    if (!analyzerType) {
      return res.status(400).send({ error: 'Analyzer type is required' });
    }
    const analysisResult = await analyzeDocument(url, analyzerType);
    const document = {
      documentId: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      documentType: analyzerType === 'document' ? 'document' : analyzerType,
      analysisResult,
      originalUrl: url,
      archivedUrl: url
    };

    const { resource: createdItem } = await container.items.create(document);
    res.status(200).send(createdItem);
  } catch (error) {
    console.error('Error in document analysis:', error.message);
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/documents', async (req, res) => {
  try {
    const { search } = req.query;
    const querySpec = search
      ? {
        query: "SELECT * FROM c WHERE CONTAINS(c.metadata, @search) OR CONTAINS(c.documentType, @search)",
        parameters: [{ name: "@search", value: search }],
      }
      : { query: "SELECT * FROM c" };

    const { resources: documents } = await container.items.query(querySpec).fetchAll();

    // Extract the filename from the original URL
    const documentsWithFilenames = documents.map(doc => ({
      ...doc,
      filename: decodeURIComponent(doc.originalUrl.split('/').pop().split('?')[0]) // Extract and decode the filename
    }));

    res.status(200).send(documentsWithFilenames);
  } catch (error) {
    console.error('Error fetching documents:', error.message);
    res.status(500).send({ error: error.message });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  const documentId = req.params.id;
  try {
    console.log(`Received request to delete document with ID: ${documentId}`);

    const querySpec = {
      query: "SELECT * FROM c WHERE c.documentId = @documentId",
      parameters: [
        { name: "@documentId", value: documentId }
      ]
    };

    console.log(`Query spec: ${JSON.stringify(querySpec)}`);

    const { resources: documents } = await container.items.query(querySpec).fetchAll();

    console.log(`Query result: ${JSON.stringify(documents)}`);

    if (documents.length === 0) {
      console.log(`Document with ID: ${documentId} not found.`);
      return res.status(404).send('Document not found');
    }

    const document = documents[0];
    const blobUrl = document.originalUrl;
    console.log(`Retrieved Blob URL: ${blobUrl}`);
    console.log(`Document to delete: ${JSON.stringify(document)}`);

    const deleteDocResponse = await deleteDocument(document.documentId);
    console.log(`Document delete response: ${JSON.stringify(deleteDocResponse)}`);

    const deleteBlobResponse = await deleteBlob(blobUrl);
    console.log(`Blob delete response: ${JSON.stringify(deleteBlobResponse)}`);

    res.status(200).send('Document and blob deleted successfully');
  } catch (error) {
    console.error('Error deleting document and blob:', error.message);
    res.status(500).send('Error deleting document and blob');
  }
});

if (process.env.NODE_ENV !== 'serverless') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
export const handler = serverless(app);
