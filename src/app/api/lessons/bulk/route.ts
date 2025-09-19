// app/api/lessons/bulk/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { lessonsSchema } from "@/lib/formValidationSchemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lessons = body.lessons;

    if (!Array.isArray(lessons)) {
      return NextResponse.json(
        { message: "Invalid payload. Expected { lessons: [] }" },
        { status: 400 }
      );
    }

    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < lessons.length; i++) {
      const row = lessons[i];

      // validate row using zod schema
      const parsed = lessonsSchema.safeParse(row);
      if (!parsed.success) {
        errors.push(
          `Row ${i + 2}: ${parsed.error.errors
            .map((e) => e.message)
            .join(", ")}`
        );
        continue;
      }

      const validated = parsed.data;

      // ensure subject exists
      const subject = await prisma.subject.findUnique({
        where: { id: validated.subjectId },
      });
      if (!subject) {
        errors.push(`Row ${i + 2}: Subject not found`);
        continue;
      }

      // delete existing lesson for same class, day, period
      await prisma.lesson.deleteMany({
        where: {
          classId: validated.classId,
          day: validated.day,
          period: validated.period,
        },
      });

      // create new lesson
      await prisma.lesson.create({
        data: {
          title: subject.name,
          day: validated.day,
          period: validated.period,
          subjectId: validated.subjectId,
          classId: validated.classId,
          teacherId: validated.teacherId,
        },
      });

      successCount++;
    }

    return NextResponse.json({
      message: `Bulk upload complete: ${successCount} lessons created.`,
      errors,
    });
  } catch (error) {
    console.error("Bulk lesson upload error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
