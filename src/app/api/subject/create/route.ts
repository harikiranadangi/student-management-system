import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, teachers } = body;

    console.log('Received data:', body); // Debugging: Check the received data

    // Check if a subject with the same name already exists
    const existingSubject = await prisma.subject.findUnique({
      where: {
        name: name.trim(),  // Check for duplicate name
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { message: `Subject with the name "${name}" already exists!` },
        { status: 409 }
      );
    }

    // Check if all teacher IDs are valid
    const validTeacherCount = await prisma.teacher.count({
      where: {
        id: { in: teachers },
      },
    });

    console.log('Valid teacher count:', validTeacherCount); // Debugging: Check how many teachers are valid

    if (validTeacherCount !== teachers.length) {
      return NextResponse.json(
        { message: 'Some teacher IDs are invalid or do not exist.' },
        { status: 400 }
      );
    }

    // Proceed with creating the new subject
    const newSubject = await prisma.subject.create({
      data: {
        name: name.trim(),
      },
    });

    console.log('New subject created:', newSubject); // Debugging: Check the created subject data

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subject:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Subject with this name already exists!' },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
