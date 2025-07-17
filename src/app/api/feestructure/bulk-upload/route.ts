// app/api/feestructure/bulk-upload/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { feeStructures } = await req.json();

    const errors: string[] = [];

    const parseDate = (value: string) => {
      const [dd, mm, yyyy] = value.split("-");
      const parsed = new Date(`${yyyy}-${mm}-${dd}`);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    const validatedData = feeStructures
      .map((row: any, index: number) => {
        const missing = [];

        if (!row.id) missing.push("id");
        if (!row.gradeId) missing.push("gradeId");
        if (!row.abacusFees) missing.push("abacusFees");
        if (!row.termFees) missing.push("termFees");
        if (!row.term) missing.push("term");
        if (!row.startDate) missing.push("startDate");
        if (!row.dueDate) missing.push("dueDate");
        if (!row.academicYear) missing.push("academicYear");

        const startDate = parseDate(row.startDate);
        const dueDate = parseDate(row.dueDate);

        if (!startDate || !dueDate) {
          errors.push(`Row ${index + 2} has invalid date(s)`);
          return null;
        }

        if (missing.length) {
          errors.push(`Row ${index + 2} missing: ${missing.join(", ")}`);
          return null;
        }

        return {
          id: parseInt(row.id),
          gradeId: parseInt(row.gradeId),
          abacusFees: parseInt(row.abacusFees),
          termFees: parseInt(row.termFees),
          term: row.term,
          startDate,
          dueDate,
          academicYear: row.academicYear,
        };
      })
      .filter(Boolean);

    if (validatedData.length) {
      await prisma.feeStructure.createMany({
        data: validatedData,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      message: "Fee structure upload completed",
      errors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
