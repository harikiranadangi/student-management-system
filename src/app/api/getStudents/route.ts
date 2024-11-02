// app/api/getStudents/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch all students from the database
        const students = await prisma.students.findMany();
        return NextResponse.json(students); // Respond with the list of students in JSON format
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure the Prisma client is disconnected after the operation
    }
}
