export function getAzureStorageAccountName(): string {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
  if (!accountName) {
    throw Error('Azure Storage accountName not found');
  }

  return accountName;
}

export function getAzureStorageAccountKey(): string {
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY as string;
  if (!accountKey) {
    throw Error('Azure Storage accountKey not found');
  }

  return accountKey;
}

export function getAzureStorageTableName(): string {
  const tableName = process.env.AZURE_STORAGE_TABLE_NAME as string;
  if (!tableName) {
    throw Error('Azure Storage tableName not found');
  }

  return tableName;
}
