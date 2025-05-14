import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { examSchema } from "@/lib/formValidationSchemas";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = examSchema.parse(json);

    const {
      title,
      examDate,
      startTime,
      gradeId,
      subjectId,
      maxMarks,
    } = parsed;

    const exam = await prisma.$transaction(async (tx) => {
      // Check or create Exam by title only
      let existingExam = await tx.exam.findUnique({
        where: { title },
      });

      if (!existingExam) {
        existingExam = await tx.exam.create({
          data: { title },
        });
      }

      // Ensure unique combination of examId, gradeId, subjectId
      const existingEGS = await tx.examGradeSubject.findFirst({
        where: {
          examId: existingExam.id,
          gradeId,
          subjectId,
        },
      });

      if (!existingEGS) {
        await tx.examGradeSubject.create({
          data: {
            examId: existingExam.id,
            gradeId,
            subjectId,
            date: new Date(examDate),
            startTime,
            maxMarks,
          },
        });
      }

      return existingExam;
    });

    return NextResponse.json({ success: true, exam }, { status: 201 });
  } catch (err) {
    console.error("[EXAM_POST_ERROR]", err);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        examGradeSubjects: {
          include: {
            Grade: true,
            Subject: true,
          },
        },
      },
    });

    return NextResponse.json({ exams }, { status: 200 });
  } catch (err) {
    console.error("[EXAM_GET_ERROR]", err);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}
