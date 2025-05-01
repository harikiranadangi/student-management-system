import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // your Prisma instance

export async function GET(
  req: Request,
  { params }: { params: Promise<{ studentId: string, term: string }> }) {
  const { studentId, term } = await params;

  try {
    const studentFees = await prisma.studentFees.findFirst({
      where: {
        studentId: studentId,
        term: term as any, // if `Term` is an enum
      },
      select: {
        id: true,
      },
    });

    if (!studentFees) {
      return NextResponse.json({ error: 'Student Fees record not found' }, { status: 404 });
    }

    return NextResponse.json({ studentFeesId: studentFees.id });
  } catch (error) {
    console.error('Error fetching student fees:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
