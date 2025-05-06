// src/lib/fees/getFullStudentFeesReport.ts
import prisma from "@/lib/prisma";
import { calculateStudentFeeReport } from "@/lib/fees/feeUtils";

export async function getFullStudentFeesReport() {
  try {
    const allStudents = await prisma.student.findMany({
      include: {
        Class: {
          include: {
            Grade: {
              include: {
                feestructure: true,
              },
            },
          },
        },
        totalFees: true,
        studentFees: {
          include: {
            feeStructure: true,
          },
        },
      },
    });

    return allStudents.map(calculateStudentFeeReport);
  } catch (error) {
    console.error("Error fetching student fees report:", error);
    throw error;
  }
}
