// app/api/students/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const students = await prisma.students.findMany();
        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
