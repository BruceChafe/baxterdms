import dotenv from 'dotenv';
import path from 'path';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, BlobClient } from '@azure/storage-blob';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error("Azure account name or key is not defined in the environment variables.");
}

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new StorageSharedKeyCredential(accountName, accountKey)
);

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

async function deleteBlob(blobUrl) {
  try {
    const blobClient = new BlobClient(blobUrl);
    await blobClient.delete();
  } catch (error) {
    console.error("Error deleting blob:", error);
    throw error;
  }
}

export { uploadFileToBlobStorage, generateSasToken, deleteBlob };
