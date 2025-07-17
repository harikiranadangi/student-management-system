import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { classes } = await req.json();

    if (!Array.isArray(classes)) {
      return NextResponse.json({ message: "Invalid input format" }, { status: 400 });
    }

    const results = {
      inserted: 0,
      skipped: 0,
      failed: 0,
      messages: [] as string[],
    };

    for (const cls of classes) {
      const section = typeof cls.section === "string" ? cls.section.trim() : null;
      const gradeId = parseInt(cls.gradeId);
      const supervisorId = typeof cls.supervisorId === "string" ? cls.supervisorId.trim() : undefined;

      if (!gradeId || isNaN(gradeId)) {
        results.skipped++;
        results.messages.push(`Missing or invalid gradeId`);
        continue;
      }

      const grade = await prisma.grade.findUnique({ where: { id: gradeId } });

      if (!grade) {
        results.skipped++;
        results.messages.push(`Grade ID ${gradeId} not found`);
        continue;
      }

      const className = `${grade.level} - ${section}`;

      const existing = await prisma.class.findFirst({
        where: { section, gradeId },
      });

      if (existing) {
        results.skipped++;
        results.messages.push(`Duplicate skipped: ${className}`);
        continue;
      }

      try {
        await prisma.class.create({
          data: {
            name: className,
            section,
            gradeId,
            supervisorId,
          },
        });
        results.inserted++;
        results.messages.push(`Inserted: ${className}`);
      } catch (error: any) {
        results.failed++;
        results.messages.push(`Failed: ${className} (${error.code}: ${error.message})`);
      }
    }

    return NextResponse.json({
      message: "Bulk class upload complete",
      ...results,
    });
  } catch (err) {
    console.error("Bulk Class Upload Error:", err);
    return NextResponse.json(
      { message: "Upload failed", error: (err as any)?.message },
      { status: 500 }
    );
  }
}
