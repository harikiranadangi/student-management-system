import prisma from "@/lib/prisma";
import { getMessageContent } from "@/lib/utils/messageUtils";
import { NextResponse } from "next/server";
import { MessageType } from "../../../../../types";

export async function PUT(req: Request) {
  const { attendanceId, present } = await req.json();

  if (!attendanceId || present === undefined) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    // Get the existing attendance record
    const existing = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    // If updating from absent to present, delete the absent message
    if (existing.present === false && present === true) {
      await prisma.messages.deleteMany({
        where: {
          studentId: existing.studentId,
          date: existing.date.toISOString(),
          type: "ABSENT",
        },
      });
    }

    // If updating from present to absent, send an absent message
    if (existing.present === true && present === false) {
      const student = await prisma.student.findUnique({
        where: { id: existing.studentId },
        select: {
          name: true,
          Class: {
            select: {
              name: true,
              Grade: {
                select: {
                  level: true,
                },
              },
            },
          },
        },
      });

      if (student) {
        const studentName = student.name;
        const className = student.Class?.name || "";

        const message = getMessageContent("ABSENT" as MessageType, {
          name: studentName,
          className: className || "Unknown",
        });

        await prisma.messages.create({
          data: {
            message,
            type: "ABSENT",
            date: new Date(existing.date).toISOString(),
            classId: existing.classId,
            studentId: existing.studentId,
          },
        });
      }
    }

    // Update the attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { present },
    });

    return NextResponse.json(updatedAttendance);
  } catch (error) {
    console.error("❌ Attendance update error:", error);
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
  }
}
