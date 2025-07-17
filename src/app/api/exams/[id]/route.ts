import { examSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

console.log("📥 Route file loaded: /api/exams/[id]/route.ts");


// This is for route like: /api/exams/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 PUT handler");
  try {
    const { id } = await params; // ✅ Await here
    const examId = parseInt(id);

    if (isNaN(examId)) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const parsed = examSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const {
      title,
      examDate,
      startTime,
      gradeId,
      subjectId,
      maxMarks,
    } = parsed.data;

    const updatedExam = await prisma.$transaction(async (tx) => {
      // Update the exam details (title)
      const exam = await tx.exam.update({
        where: { id: examId },
        data: { title },
      });

      // Update the existing examGradeSubject records (or create new ones if they don't exist)
      await tx.examGradeSubject.upsert({
        where: { examId_gradeId_subjectId: { examId, gradeId, subjectId } }, // Assuming composite unique key
        update: {
          date: new Date(examDate),
          startTime,
          maxMarks,
        },
        create: {
          examId,
          gradeId,
          subjectId,
          date: new Date(examDate),
          startTime,
          maxMarks,
        },
      });

      return exam;
    });

    return NextResponse.json(
      { success: true, message: "Exam updated successfully", data: updatedExam },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UPDATE_EXAM_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong", details: (error as any).message },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 DELETE handler");
  try {
    const { id } = await params; // ✅ Await here
    const examId = parseInt(id);

    if (isNaN(examId)) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    await prisma.exam.delete({
      where: { id: examId },
    });

    return NextResponse.json(
      { success: true, message: "Exam deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_EXAM_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong", details: (error as any).message },
      { status: 500 }
    );
  }
}
