import prisma from "@/lib/prisma";
import { getMessageContent } from "@/lib/utils/messageUtils";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { MessageType } from "../../../../../types";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Invalid or empty data" }, { status: 400 });
    }

    const operations: Prisma.PrismaPromise<any>[] = [];

    // Step 1: Build attendance key and collect IDs
    const attendanceKeys = new Set<string>();
    const absentStudentIds = new Set<string>();
    const attendanceMap = new Map<string, any>();

    for (const entry of data) {
      const dateStr = new Date(entry.date).toISOString().split("T")[0];
      const key = `${entry.studentId}_${dateStr}`;
      attendanceKeys.add(key);
      if (!entry.present) {
        absentStudentIds.add(entry.studentId);
      }
      attendanceMap.set(key, { ...entry, date: new Date(entry.date) });
    }

    // Step 2: Fetch existing attendance in one query
    const existingRecords = await prisma.attendance.findMany({
      where: {
        OR: Array.from(attendanceKeys).map((key) => {
          const [studentId, dateStr] = key.split("_");
          return {
            studentId,
            date: new Date(dateStr),
          };
        }),
      },
    });

    const existingMap = new Map<string, { id: string }>();
    for (const record of existingRecords) {
      const dateStr = record.date.toISOString().split("T")[0];
      const key = `${record.studentId}_${dateStr}`;
      existingMap.set(key, { id: String(record.id) });

    }

    // Step 3: Process operations (create/update)
    for (const key of attendanceKeys) {
      const entry = attendanceMap.get(key);
      const { studentId, present, date, ...rest } = entry;

      if (existingMap.has(key)) {
        const existing = existingMap.get(key);
        operations.push(
          prisma.attendance.update({
            where: { id: parseInt(existing!.id) },
            data: { present },
          })
        );
      } else {
        operations.push(
          prisma.attendance.create({
            data: {
              ...rest,
              studentId,
              present,
              date,
            },
          })
        );
      }
    }

    // Step 4: Fetch student + class info for absentees
    const absentStudents = await prisma.student.findMany({
      where: { id: { in: Array.from(absentStudentIds) }, status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        Class: {
          select: {
            id: true,
            name: true,
            Grade: {
              select: { level: true },
            },
          },
        },
      },
    });

    const studentInfoMap = new Map<string, typeof absentStudents[0]>();
    for (const student of absentStudents) {
      studentInfoMap.set(student.id, student);
    }

    // Step 5: Prepare messages for absentees
    for (const key of attendanceKeys) {
      const entry = attendanceMap.get(key);
      if (!entry.present) {
        const student = studentInfoMap.get(entry.studentId);
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
                date: entry.date,
                classId: entry.classId,
                studentId: entry.studentId,
              },
            })
          );
        }
      }
    }

    // Step 6: Execute all DB operations
    await prisma.$transaction(operations);

    return NextResponse.json({ success: true, count: operations.length });
  } catch (error) {
    console.error("❌ Attendance error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const absentees = await prisma.messages.findMany({
      where: { type: "ABSENT" },
      orderBy: { date: "desc" },
      include: {
        Student: { select: { name: true } },
        Class: { select: { name: true, section: true } },
      },
    });

    return NextResponse.json(absentees, { status: 200 });
  } catch (err) {
    console.error("Error fetching attendance messages:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attendance messages" },
      { status: 500 }
    );
  }
}
