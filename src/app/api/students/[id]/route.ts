import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request to retrieve a student by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const student = await prisma.students.findUnique({
            where: { id: parseInt(id) },
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// PUT request to update a student's information
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { name, grade, mobileNumber, dateOfBirth, address } = await request.json();

    try {
        const student = await prisma.students.update({
            where: { id: parseInt(id) },
            data: {
                name,
                grade,
                mobileNumber,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                address,
            },
        });
        return NextResponse.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE request to remove a student by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.students.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
