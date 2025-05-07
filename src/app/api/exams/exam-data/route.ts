// app/api/exam-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const examTitle = url.searchParams.get("examTitle");
    const gradeId = Number(url.searchParams.get("gradeId"));
    const classId = Number(url.searchParams.get("classId"));

    if (!examTitle || !gradeId || !classId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // 1. Get the exam by title
    const exam = await prisma.exam.findFirst({
      where: { title: examTitle },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // 2. Get subjects for the grade
    const subjects = await prisma.subject.findMany({
      where: {
        grades: {
          some: { id: gradeId },
        },
      },
    });

    // 3. Get students from the class
    const classWithStudents = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          select: { id: true, name: true },
        },
      },
    });

    if (!classWithStudents) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      examId: exam.id,
      subjects,
      students: classWithStudents.students,
    });
  } catch (error) {
    console.error("[FETCH_EXAM_DATA_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch exam data" }, { status: 500 });
  }
}
