import { BlobServiceClient } from '@azure/storage-blob';
import * as dotenv from 'dotenv';
import { getopt } from 'stdio';
import zlib from 'node:zlib';
import { getBlobServiceClient, getTableClient, isLink } from './src/azure-utils';
import { buildDirName, createDirectoryAsync, writeFileAsync } from './src/file-utils';

dotenv.config();
const options = getopt({
  from: {
    description: 'From created time',
    required: true,
    args: 1,
  },
  to: {
    description: 'To created time',
    required: true,
    args: 1,
  },
  'func-name': {
    description: 'Function name',
    required: true,
    args: 1,
  },
  query: {
    description: 'Query',
    required: true,
    args: 1,
  },
});

async function run() {
  const from = options?.from as string;
  const to = options?.to as string;
  const funcName = options?.['func-name'] as string;
  const query = options?.query as string;

  const blobServiceClient: BlobServiceClient = getBlobServiceClient();
  const tableClient = getTableClient();
  const filter = `CreatedTime ge datetime'${from}T00:00:00Z' and CreatedTime lt datetime'${to}T00:00:00Z' and Name eq '${funcName}'`;
  const entitiesIterator = tableClient.listEntities({
    queryOptions: {
      filter,
    },
  });
  const dirName = buildDirName();
  let numOfOperations = 0;
  let numOfFoundOperations = 0;
  for await (const entity of entitiesIterator) {
    const found: boolean = await handleEntityAsync(dirName, entity, blobServiceClient, query);
    numOfOperations++;
    if (found) {
      numOfFoundOperations++;
    }
  }

  console.log(`Number of operations: ${numOfOperations}`);
  console.log(`Number of found operations: ${numOfFoundOperations}`);

  process.exit(0);
}

async function handleEntityAsync(
  dirName: string,
  entity: Record<string, unknown>,
  blobServiceClient: BlobServiceClient,
  query: string,
): Promise<boolean> {
  const createdTime: Date = (entity.CreatedTime as Date) ?? new Date();
  const input: string = await getDataAsync(blobServiceClient, (entity.Input as string) ?? '');
  const output: string = await getDataAsync(blobServiceClient, (entity.Output as string) ?? '');
  if (input.indexOf(query) === -1 && output.indexOf(query) === -1) {
    return false;
  }

  const dirPath = await createDirectoryAsync(dirName, createdTime);

  await writeFileAsync(dirPath, 'entity.txt', entity);
  await writeFileAsync(dirPath, 'input.txt', JSON.parse(input));
  await writeFileAsync(dirPath, 'output.txt', JSON.parse(output));

  return true;
}

async function getDataAsync(blobServiceClient: BlobServiceClient, value: string): Promise<string> {
  if (!isLink(value)) {
    return value;
  }

  const url = new URL(value);
  const pathParts = url.pathname.split('/');
  const containerName = pathParts[1];
  const blobName = pathParts.slice(2).join('/');

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const archiveBuffer = await blobClient.downloadToBuffer();

  const unpackedBuffer = zlib.gunzipSync(archiveBuffer);
  value = unpackedBuffer.toString('utf8');

  return value;
}

run();
