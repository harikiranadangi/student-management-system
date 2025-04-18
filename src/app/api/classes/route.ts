import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const gradeId = Number(req.nextUrl.searchParams.get("gradeId"));
  const classes = await prisma.class.findMany({ where: { gradeId } });
  return NextResponse.json(classes);
}

