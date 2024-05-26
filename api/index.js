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
app.use(cors());

const upload = multer();

console.log("Initializing Cosmos DB client...");
const cosmosClient = new CosmosClient(process.env.VITE_COSMOS_CONNECTION_STRING);
const database = cosmosClient.database(process.env.VITE_COSMOS_DATABASE_ID);
const container = database.container(process.env.VITE_COSMOS_CONTAINER_ID);
console.log("Cosmos DB client initialized.");

console.log("Initializing Form Recognizer client...");
const client = new DocumentAnalysisClient(process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT, new AzureKeyCredential(process.env.VITE_AZURE_FORM_RECOGNIZER_KEY));
console.log("Form Recognizer client initialized.");

const analyzeDocument = async (sasUrl) => {
    console.log(`Analyzing document from URL: ${sasUrl}`);
    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", sasUrl);
    const { documents } = await poller.pollUntilDone();
    console.log(`Document analysis completed: ${JSON.stringify(documents)}`);
    return documents;
};

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log('Received file upload request...');
    try {
        if (!req.file) throw new Error('No file uploaded');
        console.log(`Uploading file: ${req.file.originalname}`);
        const containerName = 'data-archive-skeezer-motors';
        const blobUrl = await uploadFileToBlobStorage(req.file, containerName);
        console.log(`File uploaded to Blob Storage: ${blobUrl}`);
        const sasUrl = await generateSasToken(containerName, req.file.originalname);
        console.log(`Generated SAS URL: ${sasUrl}`);
        res.status(200).send({ message: 'File uploaded successfully', url: sasUrl });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).send({ error: error.message });
    }
});

app.post('/analyze', async (req, res) => {
    console.log('Received document analysis request...');
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

        console.log(`Creating document record in Cosmos DB: ${JSON.stringify(document)}`);
        const { resource: createdItem } = await container.items.create(document);
        res.status(200).send(createdItem);
    } catch (error) {
        console.error('Error in document analysis:', error.message);
        res.status(500).send({ error: error.message });
    }
});

app.get('/documents', async (req, res) => {
    console.log('Received request to fetch documents...');
    try {
        const { resources: documents } = await container.items.readAll().fetchAll();
        console.log(`Fetched documents: ${JSON.stringify(documents)}`);
        res.status(200).send(documents);
    } catch (error) {
        console.error('Error fetching documents:', error.message);
        res.status(500).send({ error: error.message });
    }
});

app.delete('/documents/:id', async (req, res) => {
    const documentId = req.params.id;
    console.log(`Received request to delete document with ID: ${documentId}`);
    try {
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

        console.log(`Deleting document from Cosmos DB with URL: ${container.url}/docs/${partitionKey}`);
        await deleteDocument(document.id, partitionKey);
        console.log(`Deleting blob from Blob Storage: ${blobUrl}`);
        await deleteBlob(blobUrl);

        res.status(200).send('Document and blob deleted successfully');
    } catch (error) {
        console.error('Error deleting document and blob:', error.message);
        res.status(500).send('Error deleting document and blob');
    }
});

// Add this block to keep the server running locally
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;
export const handler = serverless(app);
