import { examSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // Extract the examId from the URL path using split()
    const paramId = req.nextUrl.pathname.split("/")[3];

    // Parse the extracted id as integer
    const examId = parseInt(paramId);
    if (isNaN(examId)) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    // Parse the incoming request body
    const body = await req.json();
    const parse = examSchema.safeParse(body);

    // If input is invalid, return error
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    // Destructure the required fields from the parsed data
    const {
      title,
      examDate,
      startTime,
      gradeId,
      subjectId,
      maxMarks,
    } = parse.data;

    // Perform the transaction to update the exam and its associated grade/subject information
    const updated = await prisma.$transaction(async (tx) => {
      // Update the Exam's title
      const exam = await tx.exam.update({
        where: { id: examId },
        data: { title },
      });

      // Delete existing ExamGradeSubjects for the exam
      await tx.examGradeSubject.deleteMany({
        where: { examId },
      });

      // Create the updated ExamGradeSubject
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

      console.log("Exam ID:", examId);
      console.log("Parsed data:", parse.data);

      return exam;
    });

    // Return success response
    return NextResponse.json({ exam: updated }, { status: 200 });
  } catch (err) {
    console.error("Update exam error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}





export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const examId = parseInt(params.id); // ✅ No await here
    if (isNaN(examId)) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    // Delete the exam
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
