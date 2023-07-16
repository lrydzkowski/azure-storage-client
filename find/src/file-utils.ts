import fs from 'fs/promises';

export function buildDirName(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1).toString().padStart(2, '0');
  const dd = today.getDate().toString().padStart(2, '0');
  const hh = today.getHours().toString().padStart(2, '0');
  const m = today.getMinutes().toString().padStart(2, '0');
  const ss = today.getSeconds().toString().padStart(2, '0');

  return yyyy + mm + dd + '_' + hh + m + ss;
}

export async function createDirectoryAsync(dirName: string, partitionKey: string): Promise<string> {
  const dirPath = getDirPath(dirName, partitionKey);
  await fs.mkdir(dirPath, { recursive: true });

  return dirPath;
}

export function getDirPath(dirName: string, partitionKey: string): string {
  return `${__dirname}/../files/${dirName}/${partitionKey}`;
}

export async function writeFileAsync(dirPath: string, fileName: string, data: unknown): Promise<void> {
  await fs.writeFile(`${dirPath}/${fileName}`, JSON.stringify(data, null, 1), 'utf-8');
}
