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

export async function createDirectoryAsync(dirName: string, createdTime: Date): Promise<string> {
  const dirPath = getDirPath(dirName, createdTime);
  await fs.mkdir(dirPath, { recursive: true });

  return dirPath;
}

export function getDirPath(dirName: string, createdTime: Date): string {
  return `${__dirname}/../files/${dirName}/${convertToString(createdTime)}`;
}

export async function writeFileAsync(dirPath: string, fileName: string, data: unknown): Promise<void> {
  await fs.writeFile(`${dirPath}/${fileName}`, JSON.stringify(data, null, 1), 'utf-8');
}

function convertToString(createdTime: Date): string {
  const year = createdTime.getFullYear();
  const month = (createdTime.getMonth() + 1).toString().padStart(2, '0');
  const day = createdTime.getDate().toString().padStart(2, '0');
  const hours = createdTime.getHours().toString().padStart(2, '0');
  const minutes = createdTime.getMinutes().toString().padStart(2, '0');
  const seconds = createdTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = createdTime.getMilliseconds().toString().padStart(3, '0');

  const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}`;

  return formattedDate;
}
