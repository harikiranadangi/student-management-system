// app/api/ping/route.ts or pages/api/ping.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
