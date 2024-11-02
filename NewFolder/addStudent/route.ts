import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, grade, mobileNumber } = await request.json();

    try {
        const newStudent = await prisma.students.create({
            data: {
                name,
                grade,
                mobileNumber,
                // Remove teacherId as you mentioned you don't have teachers yet
            },
        });
        return NextResponse.json(newStudent);
    } catch (error: any) { // Use 'any' to allow error to be of any type
        console.error('Error adding student:', error);
        return NextResponse.json(
            { error: 'Failed to add student', details: error.message || 'Unknown error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
