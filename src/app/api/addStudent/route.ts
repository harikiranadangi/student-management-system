// app/api/addStudent/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, email, classId } = await request.json();

    try {
        const newStudent = await prisma.student.create({
            data: {
                name,
                email,
                classId: Number(classId), // Ensure classId is a number
            },
        });
        return NextResponse.json(newStudent); // Return the newly created student as JSON
    } catch (error) {
        console.error('Error adding student:', error); // Log the specific error
        return NextResponse.json({ error: 'Failed to add student' }, { status: 500 }); // Return an error message
    } finally {
        await prisma.$disconnect();
    }
}
