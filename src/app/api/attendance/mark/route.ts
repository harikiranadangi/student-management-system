import prisma from "@/lib/prisma";
import { getMessageContent } from "@/lib/utils/messageUtils";
import { NextResponse } from "next/server";
import { MessageType } from "../../../../../types";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const operations: any[] = [];

    // Process each attendance entry
    await Promise.all(
      data.map(async (entry: any) => {
        const existing = await prisma.attendance.findFirst({
          where: {
            studentId: entry.studentId,
            date: new Date(entry.date),
          },
        });

        if (existing) {
          // Update attendance if it already exists
          operations.push(
            prisma.attendance.update({
              where: { id: existing.id },
              data: {
                present: entry.present,
              },
            })
          );
        } else {
          // Create new attendance entry
          operations.push(
            prisma.attendance.create({
              data: {
                ...entry,
                date: new Date(entry.date),
              },
            })
          );

          // Only send message if student is absent
          if (!entry.present) {
            const student = await prisma.student.findUnique({
              where: { id: entry.studentId },
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

              operations.push(
                prisma.messages.create({
                  data: {
                    message,
                    type: "ABSENT",
                    date: new Date(entry.date).toISOString(),
                    classId: entry.classId,
                    studentId: entry.studentId,
                  },
                })
              );
            }
          }
        }
      })
    );

    // Run all DB operations in one transaction
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
