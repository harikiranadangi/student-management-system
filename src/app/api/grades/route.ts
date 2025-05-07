// H:\student-management-system\src\app\api\grades\route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const grades = await prisma.grade.findMany();
  return NextResponse.json(grades);
}
