// app/api/lessons/route.ts

import { lessonsSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with zod
    const validated = lessonsSchema.parse(body);

    function timeStringToDate(timeStr: string): Date {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    // Fetch the subject to get its name
    const subject = await prisma.subject.findUnique({
      where: { id: validated.subjectId },
    });

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: subject.name, // set title using subject name
        day: validated.day,
        startTime: timeStringToDate(validated.startTime),
        endTime: timeStringToDate(validated.endTime),
        subjectId: validated.subjectId,
        classId: validated.classId,
        teacherId: validated.teacherId,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    console.error("Lesson creation error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
