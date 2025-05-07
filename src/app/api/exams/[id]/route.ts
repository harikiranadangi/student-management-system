import { examSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// This is for route like: /api/exams/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      // Update exam
      const exam = await tx.exam.update({
        where: { id: examId },
        data: { title },
      });

      // Remove old links
      await tx.examGradeSubject.deleteMany({ where: { examId } });

      // Add updated link
      await tx.examGradeSubject.create({
        data: {
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const examId = parseInt(id);

    if (isNaN(examId)) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examGradeSubjects: {
          include: {
            Grade: true,
            Subject: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ exam }, { status: 200 });
  } catch (error) {
    console.error("[GET_EXAM_BY_ID_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
