// app/api/student-fees-report/route.ts
import { NextResponse } from "next/server";
import { getFullStudentFeesReport } from "@/lib/fees/getFullStudentFeesReport";

export async function GET() {
  const data = await getFullStudentFeesReport();
  return NextResponse.json(data);
}
