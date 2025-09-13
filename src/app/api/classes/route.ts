// app/api/classes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gradeId = searchParams.get("gradeId");
  const teacherId = searchParams.get("teacherId");

  try {
    const where: any = {};
    if (gradeId) {
      where.gradeId = Number(gradeId);
    }

    if(teacherId) {
      where.supervisorId = Number(teacherId);
    }

    const classes = await prisma.class.findMany({
      where,
      orderBy: { id: "asc" },
      include: {
    Teacher: {
      select: {
        id: true,
        name: true,
      },
    },
  },
    });

    return NextResponse.json(classes);
  } catch (error: any) {
    console.error("❌ Error fetching classes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
