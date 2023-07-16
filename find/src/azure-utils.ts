import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { getAzureStorageAccountKey, getAzureStorageAccountName, getAzureStorageTableName } from './configuration';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

export function getBlobServiceClient(): BlobServiceClient {
  const accountName = getAzureStorageAccountName();
  const accountKey = getAzureStorageAccountKey();
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(buildBlobHost(), sharedKeyCredential);

  return blobServiceClient;
}

export function getTableClient(): TableClient {
  const accountName = getAzureStorageAccountName();
  const accountKey = getAzureStorageAccountKey();
  const tableName = getAzureStorageTableName();
  const creds = new AzureNamedKeyCredential(accountName, accountKey);
  const client = new TableClient(buildTableHost(), tableName, creds);

  return client;
}

export function isLink(value: string): boolean {
  return value.startsWith(buildBlobHost());
}

export function buildBlobHost(): string {
  const accountName = getAzureStorageAccountName();

  return `https://${accountName}.blob.core.windows.net`;
}

export function buildTableHost(): string {
  const accountName = getAzureStorageAccountName();

  return `https://${accountName}.table.core.windows.net`;
}
