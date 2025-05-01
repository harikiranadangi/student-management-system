import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ POST /api/exams → Create exam + examGradeSubject
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      examDate,
      startTime,
      gradeId,
      subjectId,
      maxMarks,
    } = body;

    if (!title || !examDate || !startTime || !gradeId || !subjectId || !maxMarks) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const examDateOnly = new Date(examDate);

      let exam = await tx.exam.findFirst({
        where: { title, date: examDateOnly },
      });

      if (!exam) {
        exam = await tx.exam.create({
          data: { title, date: examDateOnly },
        });
      }

      const existingEGS = await tx.examGradeSubject.findFirst({
        where: {
          examId: exam.id,
          gradeId,
          subjectId,
        },
      });

      if (!existingEGS) {
        await tx.examGradeSubject.create({
          data: {
            examId: exam.id,
            gradeId,
            subjectId,
            date: examDateOnly,
            startTime,
            maxMarks,
          },
        });
      }

      return exam;
    });

    return NextResponse.json({ success: true, exam: result }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_EXAM_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ GET /api/exams?date=2025-04-29 → Fetch exams by date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const examDate = new Date(date);

    const exams = await prisma.exam.findMany({
      where: {
        date: {
          gte: new Date(examDate.setHours(0, 0, 0, 0)),
          lt: new Date(examDate.setHours(23, 59, 59, 999)),
        },
      },
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
  } catch (error) {
    console.error("[FETCH_EXAMS_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
