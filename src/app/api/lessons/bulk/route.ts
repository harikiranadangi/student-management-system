// app/api/lessons/bulk/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { lessonsSchema } from "@/lib/formValidationSchemas";



function timeStringToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

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

      const parsed = lessonsSchema.safeParse(row);
      if (!parsed.success) {
        errors.push(`Row ${i + 2}: ${parsed.error.errors.map(e => e.message).join(", ")}`);
        continue;
      }

      const validated = parsed.data;

      const startTime = timeStringToDate(validated.startTime);
      const endTime = timeStringToDate(validated.endTime);

      // Ensure subject exists
      const subject = await prisma.subject.findUnique({
        where: { id: validated.subjectId },
      });
      if (!subject) {
        errors.push(`Row ${i + 2}: Subject not found`);
        continue;
      }

      // Delete existing lesson if overlap
      await prisma.lesson.deleteMany({
        where: {
          classId: validated.classId,
          day: validated.day,
          startTime,
          endTime,
        },
      });

      await prisma.lesson.create({
        data: {
          title: subject.name,
          day: validated.day,
          startTime,
          endTime,
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
