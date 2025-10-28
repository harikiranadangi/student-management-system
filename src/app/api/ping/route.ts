// app/api/ping/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const prisma = new PrismaClient();

  // 🧩 Step 1: Check if DATABASE_URL is set
  if (!dbUrl) {
    return NextResponse.json(
      {
        status: "error",
        db: "missing",
        message: "DATABASE_URL environment variable not found",
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  // 🧩 Step 2: Try connecting to database
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      db: "connected",
      dbUrl: "valid",
      env: process.env.NODE_ENV,
      time: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        dbUrl: dbUrl ? "invalid or unreachable" : "missing",
        message: error.message || "Failed to connect to database",
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
