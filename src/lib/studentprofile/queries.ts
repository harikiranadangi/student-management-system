import prisma from "../prisma";

export const fetchStudentFeeSummary = async (studentId: string) => {
  const transactions = await prisma.feeTransaction.findMany({
    where: { studentId },
  });

  const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      Class: {
        include: {
          Grade: {
            include: {
              feestructure: true, // this is an array
            },
          },
        },
      },
    },
  });

  const feeStructures = student?.Class?.Grade?.feestructure ?? [];

  const totalDue = feeStructures.reduce((sum, fs) => {
    return sum + (fs.termFees || 0) + (fs.abacusFees || 0);
  }, 0);

  return { totalPaid, totalDue };
};
