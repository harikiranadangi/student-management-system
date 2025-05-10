// app/api/results/bulk-entry/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { gradeId, examId, entries } = await request.json();

    // Fetch subjects for the given grade
    const subjects = await prisma.subject.findMany({
      where: {
        grades: {
          some: {
            id: gradeId, // Fetch subjects associated with the grade
          },
        },
      },
    });

    // Map subjects to their IDs for easier lookups
    const subjectMap = Object.fromEntries(subjects.map(s => [s.name, s.id]));

    const results = [];

    // Iterate through each entry to save marks for each student
    for (const entry of entries) {
      for (const [subjectName, marks] of Object.entries(entry.marks)) {
        const subjectId = subjectMap[subjectName];
        if (!subjectId) continue;

        // Create a result for each student, subject, and exam
        const result = await prisma.result.create({
          data: {
            studentId: entry.studentId,
            subjectId,
            examId,
            marks: Number(marks), // Ensure marks are a number
          },
        });
        results.push(result);
      }
    }

    return NextResponse.json({ message: 'Results saved successfully', results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }
}
