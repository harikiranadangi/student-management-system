// /app/api/me/route.ts
import { fetchUserInfo } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await fetchUserInfo();
  return NextResponse.json(user);
}
