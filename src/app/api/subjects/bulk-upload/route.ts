import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subjects } = await req.json();
    const errors: string[] = [];

    const validated = subjects
      .map((row: any, index: number) => {
        const missing = [];

        if (!row.name) missing.push("name");

        if (missing.length) {
          errors.push(`Row ${index + 2} missing: ${missing.join(", ")}`);
          return null;
        }

        const subjectData: any = {
          name: row.name.trim(),
        };

        // Optional: gradeIds (e.g. [1, 2, 3])
        if (Array.isArray(row.gradeIds)) {
          subjectData.grades = {
            connect: row.gradeIds
              .map((id: any) => {
                const parsedId = parseInt(id);
                return isNaN(parsedId) ? null : { id: parsedId };
              })
              .filter(Boolean),
          };
        }

        return subjectData;
      })
      .filter(Boolean);

    const insertResults = {
      created: 0,
      failed: 0,
    };

    for (const data of validated) {
      try {
        await prisma.subject.create({
          data,
        });
        insertResults.created++;
      } catch (err: any) {
        if (err.code === "P2002") {
          errors.push(`Duplicate subject skipped: ${data.name}`);
        } else {
          errors.push(`Failed to create subject "${data.name}": ${err.message}`);
          insertResults.failed++;
        }
      }
    }

    return NextResponse.json({
      message: "Subject upload completed",
      ...insertResults,
      errors,
    });
  } catch (error) {
    console.error("Subject Bulk Upload Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
