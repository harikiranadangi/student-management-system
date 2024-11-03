// src/app/api/students/route.ts
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

export async function POST(request: Request) {
    const { name, grade, mobileNumber, dateOfBirth, address } = await request.json();

    try {
        const student = await prisma.students.create({
            data: {
                name,
                grade,
                mobileNumber,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, // Ensure date is in Date format
                address,
            },
        });
        return NextResponse.json(student);
    } catch (error) {
        console.error('Error adding student:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
