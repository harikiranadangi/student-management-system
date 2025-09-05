import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const gradeId = searchParams.get("gradeId");

  try {
    let students;

    if (classId) {
      // Fetch students filtered by classId
      students = await prisma.student.findMany({
        where: { classId: Number(classId), status: "ACTIVE" },
        include: {
          Class: true, // Include Class details if needed
        },
      });
    } else if (gradeId) {
      // Fetch students filtered by gradeId through Class relation
      students = await prisma.student.findMany({
        where: {  status: "ACTIVE",
          Class: {
            gradeId: Number(gradeId),
          },
        },
        include: {
          Class: true,
        },
      });
    } else {
      // Fetch all students
      students = await prisma.student.findMany({
        where: { status: "ACTIVE" },
        include: {
          Class: true,
        },
      });
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
