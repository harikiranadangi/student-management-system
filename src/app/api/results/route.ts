import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const examId = url.searchParams.get('examId');
  const gradeId = url.searchParams.get('gradeId');
  const classId = url.searchParams.get('classId');
  const studentId = url.searchParams.get('studentId');

  let where: any = {};

  if (studentId) {
    where = { studentId };
  } else if (examId && gradeId && classId) {
    where = {
      examId: Number(examId),
      Student: {
        is: {
          Class: {
            is: {
              id: Number(classId),
              gradeId: Number(gradeId),
            },
          },
        },
      },
    };
  } else if (examId) {
    where = { examId: Number(examId) };
  }

  // 1. Get results with needed relations
  const results = await prisma.result.findMany({
    where,
    include: {
      Student: {
        include: {
          Class: {
            select: { gradeId: true },
          },
        },
      },
      Subject: true,
      Exam: true,
    },
  });

  // 2. Extract examId, subjectId, and gradeId triplets
  const triplets = results.map((r) => ({
    examId: r.examId,
    subjectId: r.subjectId,
    gradeId: r.Student.Class.gradeId,
  }));

  // 3. Fetch matching ExamGradeSubject entries
  const examGradeSubjects = await prisma.examGradeSubject.findMany({
    where: {
      OR: triplets.map((t) => ({
        examId: t.examId,
        subjectId: t.subjectId,
        gradeId: t.gradeId,
      })),
    },
  });

  // 4. Build a map for quick lookup
  const maxMarksMap = new Map<string, number>();
  for (const egs of examGradeSubjects) {
    const key = `${egs.examId}-${egs.subjectId}-${egs.gradeId}`;
    maxMarksMap.set(key, egs.maxMarks);
  }

  // 5. Merge maxMarks into result list
  const resultsWithMaxMarks = results.map((r) => {
    const key = `${r.examId}-${r.subjectId}-${r.Student.Class.gradeId}`;
    return {
      ...r,
      maxMarks: maxMarksMap.get(key) ?? 100, // default to 100 if not found
    };
  });

  return NextResponse.json({ results: resultsWithMaxMarks });
}
