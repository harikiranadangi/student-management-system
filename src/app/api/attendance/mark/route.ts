import prisma from "@/lib/prisma";
import { getMessageContent } from "@/lib/utils/messageUtils";
import { NextResponse } from "next/server";
import { MessageType } from "../../../../../types";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const operations: any[] = [];

    for (const entry of data) {
      const entryDate = new Date(entry.date);

      const existing = await prisma.attendance.findFirst({
        where: {
          studentId: entry.studentId,
          date: entryDate,
        },
      });

      if (existing) {
        operations.push(
          prisma.attendance.update({
            where: { id: existing.id },
            data: {
              present: entry.present,
            },
          })
        );
      } else {
        operations.push(
          prisma.attendance.create({
            data: {
              ...entry,
              date: entryDate,
            },
          })
        );
      }

      // 👇 Only send message if student is absent
      if (!entry.present) {
        const student = await prisma.student.findUnique({
          where: { id: entry.studentId },
          select: {
            name: true,
            Class: {
              select: {
                name: true,
                Grade: {
                  select: { level: true },
                },
              },
            },
          },
        });

        if (student) {
          const studentName = student.name;
          const className = student.Class?.name || "Unknown";

          const message = getMessageContent("ABSENT" as MessageType, {
            name: studentName,
            className,
          });

          operations.push(
            prisma.messages.create({
              data: {
                message,
                type: "ABSENT",
                date: entryDate.toISOString(),
                classId: entry.classId,
                studentId: entry.studentId,
              },
            })
          );
        }
      }
    }

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Attendance error:", error);
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    );
  }
}
