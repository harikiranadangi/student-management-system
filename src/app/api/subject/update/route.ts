import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) { // Ensure PUT method here
  try {
    const body = await req.json();
    const { id, name, teachers } = body;


    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }

    // Check for duplicate subject name (except current)
    const duplicateName = await prisma.subject.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    });

    if (duplicateName) {
      return NextResponse.json(
        { message: `Another subject with the name "${name}" already exists!` },
        { status: 409 }
      );
    }

    // Update subject name
    await prisma.subject.update({
      where: { id },
      data: { name: name.trim() },
    });

    // Delete old teacher relations
    await prisma.subjectTeacher.deleteMany({
      where: { subjectId: id },
    });

    // Create new teacher relations
    const connectData = teachers.map((teacherId: string) => ({
      subjectId: id,
      teacherId,
    }));

    await prisma.subjectTeacher.createMany({
      data: connectData,
    });

    

    // Return updated subject with teachers included
    const updatedSubject = await prisma.subject.findUnique({
      where: { id },
      include: {
        teachers: {
          include: {
            teacher: {
              select: { name: true },
            },
          },
        },
      },
    });

    console.log("Updated Date: ",connectData )

    return NextResponse.json(updatedSubject, { status: 200 });
  } catch (error: any) {
    console.error('Error updating subject:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
