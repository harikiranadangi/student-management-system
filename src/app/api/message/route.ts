// app/api/messages/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, type, date, studentId, classId, gradeId } = await req.json();

    const formattedDate = date ? new Date(date).toISOString() : new Date().toISOString();

    // 1. Send to specific student
    if (studentId) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          type,
          date: formattedDate,
          ...(classId && { Class: { connect: { id: Number(classId) } } }),
          Student: { connect: { id: (studentId) } },
        },
      });
      return NextResponse.json(
        { success: true, message: "Message created", data: newMessage, count: 1 }, { status: 201 });
    }

    // 2. Send to all students in a class
    if (classId) {
      const studentsInClass = await prisma.student.findMany({
        where: { classId: Number(classId) },
      });

      const messages = await Promise.all(
        studentsInClass.map((student) =>
          prisma.messages.create({
            data: {
              message,
              type,
              date: formattedDate,
              Class: { connect: { id: Number(classId) } },
              Student: { connect: { id: student.id } },
            },
          })
        )
      );
      return NextResponse.json({ success: true, message: "Message sent to all students", count: messages.length }, { status: 201 });
    }

    // 3. Send to all students in a grade
    if (gradeId) {
      const classesInGrade = await prisma.class.findMany({
        where: { gradeId: Number(gradeId) },
        select: { id: true },
      });

      const classIds = classesInGrade.map((cls) => cls.id);

      const studentsInGrade = await prisma.student.findMany({
        where: { classId: { in: classIds } },
      });

      const messages = await Promise.all(
        studentsInGrade.map((student) =>
          prisma.messages.create({
            data: {
              message,
              type,
              date: formattedDate,
              Class: { connect: { id: student.classId } },
              Student: { connect: { id: student.id } },
            },
          })
        )
      );

      return NextResponse.json({ messagessuccess: true, message: "Message sent to all students", count: messages.length }, { status: 201 });
    }

    // 4. Send to all students
    const allStudents = await prisma.student.findMany();

    const messages = await Promise.all(
      allStudents.map((student) =>
        prisma.messages.create({
          data: {
            message,
            type,
            date: formattedDate,
            ...(student.classId && { Class: { connect: { id: student.classId } } }),
            Student: { connect: { id: student.id } },
          },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Message sent to all students", count: messages.length }, { status: 201 });

  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ success: false, message: "Failed to create message" }, { status: 500 });
  }
}
