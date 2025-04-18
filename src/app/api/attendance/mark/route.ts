import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const operations: any[] = [];

    for (const entry of data) {
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId: entry.studentId,
          date: new Date(entry.date),
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
              date: new Date(entry.date),
            },
          })
        );
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
