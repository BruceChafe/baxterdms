import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, BlobClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
import path from 'path';
import { CosmosClient } from '@azure/cosmos';

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
  console.log("Generating SAS Token...");
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  console.log(`Container: ${containerName}, Blob: ${blobName}`);

  const permissions = new BlobSASPermissions();
  permissions.read = true;
  permissions.delete = true;
  console.log(`Permissions: ${permissions.toString()}`);

  const now = new Date();
  const startTime = new Date(now.valueOf() - 15 * 60 * 1000);
  const expiryTime = new Date(now.valueOf() + 3600 * 1000);
  console.log(`Start Time: ${startTime.toISOString()}, Expiry Time: ${expiryTime.toISOString()}`);

  const sasOptions = {
    containerName,
    blobName,
    permissions: permissions.toString(),
    startsOn: startTime,
    expiresOn: expiryTime
  };

  console.log("SAS Options: ", sasOptions);

  try {
    const sasToken = generateBlobSASQueryParameters(sasOptions, new StorageSharedKeyCredential(accountName, accountKey)).toString();
    console.log(`Generated SAS Token: ${sasToken}`);
    return `${blobClient.url}?${sasToken}`;
  } catch (error) {
    console.error("Error generating SAS token:", error);
    throw error;
  }
}

async function uploadFileToBlobStorage(file, containerName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(file.originalname);
  await blobClient.uploadData(file.buffer);
  return blobClient.url;
}

async function deleteAllSnapshots(containerName, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  let iter = containerClient.listBlobsFlat({
    prefix: blobName,
    includeSnapshots: true,
  });

  for await (const blob of iter) {
    if (blob.snapshot) {
      const snapshotClient = containerClient.getBlobClient(blob.name).withSnapshot(blob.snapshot);
      console.log(`Deleting snapshot: ${blob.snapshot}`);
      await snapshotClient.delete();
    }
  }
}

async function deleteBlob(blobUrl) {
  try {
    console.log(`Deleting blob at URL: ${blobUrl}`);
    const blobClient = new BlobClient(blobUrl);
    const containerName = blobClient.containerName;
    const blobName = blobClient.name;

    await deleteAllSnapshots(containerName, blobName);

    // Check if the blob exists before attempting to delete
    if (await blobClient.exists()) {
      await blobClient.delete();
      console.log('Blob deleted successfully');
    } else {
      console.log('Blob already deleted or not found.');
    }
  } catch (error) {
    console.error("Error deleting blob:", error);
    throw error;
  }
}

async function deleteDocument(documentId, partitionKey) {
  try {
    const database = cosmosClient.database(cosmosDatabaseId);
    const container = database.container(cosmosContainerId);

    console.log(`Attempting to delete document with ID: ${documentId}, Partition Key: ${partitionKey}`);

    // Check if the document exists before attempting to delete
    const { resource: existingDocument } = await container.item(documentId, partitionKey).read();
    if (existingDocument) {
      console.log(`Document found: ${JSON.stringify(existingDocument)}`);
      await container.item(documentId, partitionKey).delete();
      console.log('Document deleted successfully');
    } else {
      console.log('Document already deleted or not found.');
    }
  } catch (error) {
    if (error.code === 404) {
      console.log('Document not found or already deleted.');
    } else {
      console.error("Error deleting document:", error);
      throw error;
    }
  }
}

export { uploadFileToBlobStorage, generateSasToken, deleteBlob, deleteDocument };
