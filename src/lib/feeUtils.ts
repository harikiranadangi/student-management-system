export type StudentFee = {
  feeStructure: {
    termFees: number;
    abacusFees: number | null;
  };
  paidAmount: number;
  discountAmount: number;
  fineAmount?: number;
};

export type Student = {
  id: string;
  name: string;
  parentName: string | null;
  phone: string | null;
  Class?: { name: string };
  studentFees: StudentFee[];
};

export type StudentFeeReportRow = {
  id: string;
  name: string;
  parentName: string | null;
  phone: string | null;
  className: string;
  totalFees: number;
  totalPaidAmount: number;
  totalDiscountAmount: number;
  totalFineAmount: number;
  dueAmount: number;
};

export const calculateStudentFeeReport = (student: Student): StudentFeeReportRow => {
  const totalFees = student.studentFees.reduce((sum, sf) => {
    return sum + (sf.feeStructure.termFees || 0) + (sf.feeStructure.abacusFees ?? 0);
  }, 0);

  const totalPaidAmount = student.studentFees.reduce((sum, sf) => sum + (sf.paidAmount || 0), 0);
  const totalDiscountAmount = student.studentFees.reduce((sum, sf) => sum + (sf.discountAmount || 0), 0);
  const totalFineAmount = student.studentFees.reduce((sum, sf) => sum + (sf.fineAmount || 0), 0);
  const dueAmount = totalFees - totalPaidAmount + totalFineAmount - totalDiscountAmount;

  return {
    id: student.id,
    name: student.name,
    parentName: student.parentName,
    phone: student.phone,
    className: student.Class?.name || "-",
    totalFees,
    totalPaidAmount,
    totalDiscountAmount,
    totalFineAmount,
    dueAmount,
  };
};
