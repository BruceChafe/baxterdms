const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, BlobClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;
const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const cosmosDatabaseId = process.env.COSMOS_DATABASE_ID;
const cosmosContainerId = process.env.COSMOS_CONTAINER_ID;

if (!accountName || !accountKey || !cosmosEndpoint || !cosmosKey || !cosmosDatabaseId || !cosmosContainerId) {
  throw new Error("Azure account or Cosmos DB details are not defined in the environment variables.");
}

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new StorageSharedKeyCredential(accountName, accountKey)
);

const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });

async function generateSasToken(containerName, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const permissions = new BlobSASPermissions();
  permissions.read = true;
  permissions.delete = true;

  const now = new Date();
  const startTime = new Date(now.valueOf() - 15 * 60 * 1000);
  const expiryTime = new Date(now.valueOf() + 3600 * 1000);

  const sasOptions = {
    containerName,
    blobName,
    permissions: permissions.toString(),
    startsOn: startTime,
    expiresOn: expiryTime,
  };

  return generateBlobSASQueryParameters(sasOptions, new StorageSharedKeyCredential(accountName, accountKey)).toString();
}

async function uploadFileToBlobStorage(file, containerName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(file.originalname);
  await blobClient.uploadData(file.buffer);
  return blobClient.url;
}

async function deleteBlob(blobUrl) {
  const blobClient = new BlobClient(blobUrl);
  if (await blobClient.exists()) {
    await blobClient.delete();
  }
}

async function deleteDocument(documentId, partitionKey) {
  const database = cosmosClient.database(cosmosDatabaseId);
  const container = database.container(cosmosContainerId);

  const { resource: existingDocument } = await container.item(documentId, partitionKey).read();
  if (existingDocument) {
    await container.item(documentId, partitionKey).delete();
  }
}

module.exports = { uploadFileToBlobStorage, generateSasToken, deleteBlob, deleteDocument };
