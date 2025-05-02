import prisma from "./prisma";

export async function getGroupedStudentFees() {
  const students = await prisma.student.findMany({
    include: {
      studentFees: {
        include: {
          feeStructure: true, // Include the related FeeStructure data
        },
      },
      totalFees: true, // Include totalFees data if necessary
    },
  });

  const groupedData = students.map((student) => {
    // Sum the values across all studentFees (one for each term)
    const totalPaidAmount = student.studentFees.reduce((acc, fee) => acc + fee.paidAmount, 0);
    const totalDiscountAmount = student.studentFees.reduce((acc, fee) => acc + fee.discountAmount, 0);
    const totalFineAmount = student.studentFees.reduce((acc, fee) => acc + fee.fineAmount, 0);
    const totalAbacusAmount = student.studentFees.reduce((acc, fee) => acc + (fee.abacusPaidAmount || 0), 0);
    
    // Now we access feeStructure for each term
    const totalFeeAmount = student.studentFees.reduce((acc, fee) => acc + (fee.feeStructure?.termFees || 0), 0); 
    const dueAmount = student.studentFees.reduce((acc, fee) => acc + (fee.feeStructure?.termFees || 0) - fee.paidAmount, 0);

    // Determine the status based on whether the student has fully paid or not
    const status = totalPaidAmount >= totalFeeAmount ? "Paid" : "Not Paid";

    return {
      studentId: student.id,
      studentName: student.name,
      totalPaidAmount,
      totalDiscountAmount,
      totalFineAmount,
      totalAbacusAmount,
      totalFeeAmount,
      dueAmount,
      status,
    };
  });

  return groupedData;
}
