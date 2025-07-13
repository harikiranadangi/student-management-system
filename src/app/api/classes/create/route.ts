// src/app/api/classes/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { classSchema } from "@/lib/formValidationSchemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming request body:", body);

    const parsed = classSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { section, gradeId, supervisorId } = parsed.data;
    const cleanedSupervisorId = supervisorId?.trim() || undefined;

    // Get grade
    const grade = await prisma.grade.findUnique({ where: { id: gradeId } });
    if (!grade) {
      return NextResponse.json(
        { success: false, error: "Invalid grade ID" },
        { status: 400 }
      );
    }

    // Generate name
    const name = `${grade.level} - ${section}`;

    // Remove supervisor from existing class if already assigned
    if (cleanedSupervisorId) {
      await prisma.class.updateMany({
        where: { supervisorId: cleanedSupervisorId },
        data: { supervisorId: null },
      });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section,
        gradeId,
        supervisorId: cleanedSupervisorId,
      },
    });

    return NextResponse.json({ success: true, data: newClass }, { status: 201 });

  } catch (error: any) {
    console.error("API error:", error);

    if (error.code === "P2002") {
      const target = error.meta?.target || [];
      if (target.includes("Class_gradeId_section_key")) {
        return NextResponse.json(
          { success: false, error: "Class with this grade and section already exists." },
          { status: 409 }
        );
      }
      if (target.includes("supervisorId")) {
        return NextResponse.json(
          { success: false, error: "This supervisor is already assigned to another class." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
