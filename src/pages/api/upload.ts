// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const upload = multer({
    storage: multer.memoryStorage(),
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadHandler = upload.single('file');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        uploadHandler(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'File upload error' });
            }

            const results: any[] = [];

            // Parse the CSV data
            fs.createReadStream(req.file.buffer)
                .pipe(csvParser())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        await prisma.student.createMany({ data: results });
                        res.status(200).json({ message: 'Users added successfully' });
                    } catch (dbError) {
                        console.error(dbError);
                        res.status(500).json({ error: 'Database error' });
                    } finally {
                        await prisma.$disconnect();
                    }
                });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
