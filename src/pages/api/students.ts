// pages/api/students.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const students = await prisma.student.findMany();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ error: 'Database error' });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
