// lib/getGroupedStudentFees.ts

import prisma from "./prisma";


export async function getGroupedStudentFees() {
  const students = await prisma.student.findMany({
    include: {
      studentFees: {
        include: {
          feeStructure: true, // get fee details for calculation
        },
      },
    },
  });

  const groupedData = students.map((student) => {
    let totalPaidAmount = 0;
    let totalAbacusAmount = 0;
    let totalFeeAmount = 0;

    student.studentFees.forEach((fee) => {
      const termFee = fee.feeStructure?.termFees || 0;
      const abacusFee = fee.feeStructure?.abacusFees || 0;
      const paidAmount = fee.paidAmount || 0;

      totalPaidAmount += paidAmount;
      totalAbacusAmount += abacusFee;
      totalFeeAmount += termFee + abacusFee;
    });

    return {
      studentId: student.id,
      totalPaidAmount,
      totalAbacusAmount,
      totalFeeAmount,
    };
  });

  return groupedData;
}
