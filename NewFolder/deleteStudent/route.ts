// app/api/deleteStudent/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
    const { id } = await request.json(); // Get the student ID from the request body

    try {
        // Delete the student record
        const deletedStudent = await prisma.students.delete({
            where: {
                id: id, // Use the ID to find the student record
            },
        });
        return NextResponse.json(deletedStudent);
    } catch (error: unknown) { // Specify the error type as unknown
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Type guard to check if error is an instance of Error
        console.error('Error deleting student:', errorMessage);
        return NextResponse.json(
            { error: 'Failed to delete student', details: errorMessage },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
