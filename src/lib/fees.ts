// lib/getGroupedStudentFees.ts

import prisma from "./prisma";

export async function getGroupedStudentFees() {
  const students = await prisma.student.findMany({
    include: {
      totalFees: true, // Fetch totalFees data
    },
  });

  const groupedData = students.map((student) => {
    // Make sure there's at least one entry in totalFees array
    const totalFee = student.totalFees && student.totalFees[0]; // Access first element of the array

    // Defaulting to 0 if no fee data exists
    const totalPaidAmount = totalFee?.totalPaidAmount || 0;
    const totalDiscountAmount = totalFee?.totalDiscountAmount || 0;
    const totalFeeAmount = totalFee?.totalFeeAmount || 0;
    const dueAmount = totalFee?.dueAmount || 0;
    const status = totalFee?.status || "Not Paid";
    const totalAbacusAmount = totalFee?.totalAbacusAmount || 0;

    return {
      studentId: student.id,
      studentName: student.name,
      totalPaidAmount,
      totalAbacusAmount,
      totalDiscountAmount,
      totalFeeAmount,
      dueAmount,
      status,
    };
  });

  return groupedData;
}
