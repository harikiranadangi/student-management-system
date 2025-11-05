import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🧹 Clean incoming data: remove id if it exists
    const { id, ...data } = body;

    // 🧠 Ensure no id is passed to Prisma
    if ("id" in body) {
      console.warn("⚠️ Incoming data contained id, removing it:", body.id);
    }

    // 🧩 Check if already exists (unique gradeId, term, academicYear)
    const existing = await prisma.feeStructure.findUnique({
      where: {
        gradeId_term_academicYear: {
          gradeId: data.gradeId,
          term: data.term,
          academicYear: data.academicYear,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Fee structure already exists for this grade, term, and academic year." },
        { status: 409 }
      );
    }

    // ✅ Create new record (no id field)
    const fee = await prisma.feeStructure.create({
      data: {
        gradeId: data.gradeId,
        term: data.term,
        academicYear: data.academicYear,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        termFees: Number(data.termFees),
        abacusFees: data.abacusFees ? Number(data.abacusFees) : 0,
      },
    });

    return NextResponse.json({ success: true, fee }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Fee creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
