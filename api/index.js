import express from 'express';
import serverless from 'serverless-http';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { uploadFileToBlobStorage, generateSasToken, deleteBlob, deleteDocument } from '../src/components/documentArchive/utilities/useBlobStorageClient.js';
import { CosmosClient } from '@azure/cosmos';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://baxterdms.vercel.app'];
app.use(cors({
  origin: function(origin, callback) {
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

// Initialize Cosmos DB client
const cosmosClient = new CosmosClient(process.env.VITE_COSMOS_CONNECTION_STRING);
const database = cosmosClient.database(process.env.VITE_COSMOS_DATABASE_ID);
const container = database.container(process.env.VITE_COSMOS_CONTAINER_ID);

// Initialize Form Recognizer client
const client = new DocumentAnalysisClient(process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT, new AzureKeyCredential(process.env.VITE_AZURE_FORM_RECOGNIZER_KEY));

const analyzeDocument = async (sasUrl) => {
    console.log(`Starting analysis for URL: ${sasUrl}`);
    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", sasUrl);
    const result = await poller.pollUntilDone();
    console.log(`Analysis complete for URL: ${sasUrl}`);
    return result.documents;
};

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) throw new Error('No file uploaded');
        const containerName = 'data-archive-skeezer-motors';
        const blobUrl = await uploadFileToBlobStorage(req.file, containerName);
        const sasUrl = await generateSasToken(containerName, req.file.originalname);
        res.status(200).send({ message: 'File uploaded successfully', url: sasUrl });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).send({ error: error.message });
    }
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).send({ error: 'URL is required' });
        }
        const analysisResult = await analyzeDocument(url);
        const document = {
            documentId: new Date().toISOString(),
            uploadDate: new Date().toISOString(),
            documentType: 'invoice',
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
        const { resources: documents } = await container.items.readAll().fetchAll();
        res.status(200).send(documents);
    } catch (error) {
        console.error('Error fetching documents:', error.message);
        res.status(500).send({ error: error.message });
    }
});

app.delete('/api/documents/:id', async (req, res) => {
    const documentId = req.params.id;
    try {
        console.log(`Attempting to delete document with ID: ${documentId}`);
        
        const { resources: documents } = await container.items.query({
            query: "SELECT * FROM c WHERE c.documentId = @documentId",
            parameters: [
                { name: "@documentId", value: documentId }
            ]
        }).fetchAll();
        
        if (documents.length === 0) {
            console.log(`Document with ID: ${documentId} not found.`);
            return res.status(404).send('Document not found');
        }

        const document = documents[0];
        const blobUrl = document.originalUrl;
        const partitionKey = document.documentId;
        console.log(`Retrieved Blob URL: ${blobUrl}`);
        console.log(`Partition Key: ${partitionKey}`);

        console.log(`Deleting document with URL: ${container.url}/docs/${partitionKey}`);
        
        await deleteDocument(document.id, partitionKey);
        await deleteBlob(blobUrl);

        res.status(200).send('Document and blob deleted successfully');
    } catch (error) {
        console.error('Error deleting document and blob:', error.message);
        res.status(500).send('Error deleting document and blob');
    }
});

// Only run the server if not in a serverless environment
if (process.env.NODE_ENV !== 'serverless') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
export const handler = serverless(app);
