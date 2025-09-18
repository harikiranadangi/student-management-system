// app/api/lessons/route.ts

import { lessonsSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validated = lessonsSchema.parse(body);

    function timeStringToDate(timeStr: string): Date {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    const startTime = timeStringToDate(validated.startTime);
    const endTime = timeStringToDate(validated.endTime);

    // Check if the subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: validated.subjectId },
    });
    

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    // Delete any existing lesson for the same class, day, startTime, and endTime
    await prisma.lesson.deleteMany({
      where: {
        classId: validated.classId,
        day: validated.day,
        startTime,
        endTime,
      },
    });

    // Create the new lesson
    const lesson = await prisma.lesson.create({
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

    console.log("Created lesson:", lesson);

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    console.error("Lesson creation error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
