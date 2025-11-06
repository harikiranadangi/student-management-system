// src/lib/fees/getFullStudentFeesReport.ts
import prisma from "@/lib/prisma";
import { calculateStudentFeeReport } from "@/lib/fees/feeUtils";

export async function getFullStudentFeesReport() {
  try {
    const allStudents = await prisma.student.findMany({
      where: { status: "ACTIVE" },
      include: {
        Class: {
          include: {
            Grade: {
              include: { feestructure: true },
            },
          },
        },
        totalFees: true,
        studentFees: { include: { feeStructure: true } },
      },
    });

    // ✅ Normalize Class.name before passing to calculateStudentFeeReport
    return allStudents.map((student) =>
      calculateStudentFeeReport({
        ...student,
        Class: { name: student.Class?.name ?? "-" },
      })
    );
  } catch (error) {
    console.error("Error fetching student fees report:", error);
    throw error;
  }
}
