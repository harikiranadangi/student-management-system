import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { homeworkSchema } from "@/lib/formValidationSchemas";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = homeworkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid data", errors: parsed.error.errors }, { status: 400 });
    }

    const { description, gradeId, classId, date } = parsed.data;

    // If classId is given → create single
    if (classId !== undefined) {
      const hw = await prisma.homework.create({
        data: { description, gradeId, classId, date },
      });

      return NextResponse.json({ success: true, data: hw });
    }

    // Else: bulk create for all classes under grade
    const groupId = uuidv4();

    const classes = await prisma.class.findMany({
      where: { gradeId },
      select: { id: true },
    });

    const data = classes.map(({ id }) => ({
      description,
      gradeId,
      classId: id,
      date,
      groupId,
    }));

    await prisma.homework.createMany({ data });

    return NextResponse.json({ success: true, groupId });
  } catch (err) {
    console.error("POST /api/homeworks error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
