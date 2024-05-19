const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

const { uploadFileToBlobStorage, generateSasToken, deleteBlob, deleteDocument } = require('./utilities.cjs');
const { CosmosClient } = require('@azure/cosmos');
const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const router = express.Router();
const upload = multer();

const accountName = process.env.AZURE_ACCOUNT_NAME || process.env.VITE_AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY || process.env.VITE_AZURE_ACCOUNT_KEY;
const cosmosEndpoint = process.env.COSMOS_ENDPOINT || process.env.VITE_COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY || process.env.VITE_COSMOS_KEY;
const cosmosDatabaseId = process.env.COSMOS_DATABASE_ID || process.env.VITE_COSMOS_DATABASE_ID;
const cosmosContainerId = process.env.COSMOS_CONTAINER_ID || process.env.VITE_COSMOS_CONTAINER_ID;
const formRecognizerEndpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT || process.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT;
const formRecognizerKey = process.env.AZURE_FORM_RECOGNIZER_KEY || process.env.VITE_AZURE_FORM_RECOGNIZER_KEY;

if (!accountName || !accountKey || !cosmosEndpoint || !cosmosKey || !cosmosDatabaseId || !cosmosContainerId || !formRecognizerEndpoint || !formRecognizerKey) {
  throw new Error("Missing required environment variables");
}

const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
const database = cosmosClient.database(cosmosDatabaseId);
const container = database.container(cosmosContainerId);
const formClient = new DocumentAnalysisClient(formRecognizerEndpoint, new AzureKeyCredential(formRecognizerKey));

app.use(cors({ origin: ['http://localhost:5173', 'https://classy-zuccutto-c75876.netlify.app'] }));
app.use(express.json());

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const containerName = 'data-archive-skeezer-motors';
    const blobUrl = await uploadFileToBlobStorage(req.file, containerName);
    const sasUrl = await generateSasToken(containerName, req.file.originalname);
    res.status(200).send({ url: sasUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ error: error.message });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const poller = await formClient.beginAnalyzeDocumentFromUrl('prebuilt-invoice', req.body.url);
    const { documents } = await poller.pollUntilDone();
    const document = {
      documentId: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      documentType: 'invoice',
      analysisResult: documents,
      originalUrl: req.body.url,
      archivedUrl: req.body.url,
    };

    await container.items.create(document);
    res.status(200).send(document);
  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).send({ error: error.message });
  }
});

router.get('/documents', async (req, res) => {
  try {
    const { resources: documents } = await container.items.readAll().fetchAll();
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send({ error: error.message });
  }
});

router.delete('/documents/:id', async (req, res) => {
  try {
    const { resources: documents } = await container.items.query({
      query: 'SELECT * FROM c WHERE c.documentId = @documentId',
      parameters: [{ name: '@documentId', value: req.params.id }],
    }).fetchAll();

    if (documents.length === 0) {
      return res.status(404).send('Document not found');
    }

    const document = documents[0];
    await deleteDocument(document.id, document.documentId);
    await deleteBlob(document.originalUrl);

    res.status(200).send('Document and blob deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).send({ error: error.message });
  }
});

app.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);
