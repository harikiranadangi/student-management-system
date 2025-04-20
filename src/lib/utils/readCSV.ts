// prisma/utils/readCSV.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export async function readCSV(relativePath: string) {
  const filePath = path.join(__dirname, '../../data', relativePath);
  const results: any[] = [];
  return new Promise<any[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}
