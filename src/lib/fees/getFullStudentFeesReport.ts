// src/lib/fees/getFullStudentFeesReport.ts
import prisma from "@/lib/prisma";
import { calculateStudentFeeReport } from "@/lib/feeUtils";

export async function getFullStudentFeesReport() {
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

  const studentReportData = allStudents.map(calculateStudentFeeReport);
  return studentReportData;
}
