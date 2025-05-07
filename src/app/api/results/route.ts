// src/app/api/results/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const examId = Number(searchParams.get("examId"));
    const gradeId = Number(searchParams.get("gradeId"));
    const classId = Number(searchParams.get("classId"));

    if (!examId || !gradeId || !classId) {
      return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
    }

    const results = await prisma.result.findMany({
      where: {
        examId,
        Student: {
          classId,
        },
        Subject: {
          grades: {
            some: {
              id: gradeId,
            },
          },
        },
      },
      include: {
        Student: true,
        Subject: true,
        Exam: true,
      },
    });
    

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("[FETCH_RESULTS_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
