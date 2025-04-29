import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/exams
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      examDate,      // date of the exam (e.g., "2025-04-29")
      startTime,     // time component (e.g., "10:00:00")
      gradeId,
      subjectId,
      maxMarks,
    } = body;

    if (!title || !examDate || !startTime || !gradeId || !subjectId || !maxMarks) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if exam exists for given title and date (without time)
      const examDateOnly = new Date(examDate);
      let exam = await tx.exam.findFirst({
        where: {
          title,
          date: examDateOnly,
        },
      });

      if (!exam) {
        exam = await tx.exam.create({
          data: {
            title,
            date: examDateOnly,
          },
        });
      }

      // 2. Create ExamGradeSubject entry
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
            startTime: startTime,
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

// Function to get all exams for a specific day (e.g., 2025-04-29)
export async function getExamsForDate(request: Request) {
  try {
    const { date } = await request.json(); // Date in format "2025-04-29"
    
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const examDate = new Date(date);
    
    // Query for all exams on the specific date
    const exams = await prisma.exam.findMany({
      where: {
        date: {
          gte: new Date(examDate.setHours(0, 0, 0, 0)), // start of the day
          lt: new Date(examDate.setHours(23, 59, 59, 999)), // end of the day
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
