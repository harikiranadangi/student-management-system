import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const classId = searchParams.get("classId");
  const gradeId = searchParams.get("gradeId");

  if (!from || !to) {
    return NextResponse.json({ error: "From and To dates are required" }, { status: 400 });
  }

  const filters: any = {
    date: {
      gte: new Date(from),
      lte: new Date(to),
    },
  };

  if (classId) {
    filters.classId = Number(classId);
  } else if (gradeId) {
    const classes = await prisma.class.findMany({
      where: { gradeId: Number(gradeId) },
      select: { id: true },
    });
    filters.classId = {
      in: classes.map((c) => c.id),
    };
  }

  const attendance = await prisma.attendance.findMany({
    where: filters,
    orderBy: { date: "desc" },
  });

  const studentIds = [...new Set(attendance.map((a) => a.studentId))];

  const students = await prisma.student.findMany({
    where: { id: { in: studentIds }, status: "ACTIVE" },
    include: {
      Class: true, // 👈 important to show class name in frontend
    },
  });
  
  return NextResponse.json({ attendance, students });
}
