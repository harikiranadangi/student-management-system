import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const gradeId = searchParams.get("gradeId");

  try {
    let students;

    if (classId) {
      // Fetch students based on classId
      students = await prisma.student.findMany({
        where: { classId: Number(classId) },
      });
    } else if (gradeId) {
      // Fetch students based on gradeId
      students = await prisma.student.findMany({
        where: {
          Class: {
            gradeId: Number(gradeId),
          },
        },
        include: {
          Class: true,
        },
      });
    } else {
      // Fetch all students when no classId or gradeId is provided
      students = await prisma.student.findMany();
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
