import React from "react";
import prisma from "@/lib/prisma";
import FeesTable from "./FeesTable";
import { FeeStructure, FeeTransaction } from "@prisma/client";

interface StudentFees {
  id: number;
  studentId: string;
  feeStructureId: number;
  term: string;
  paidAmount: number;
  discountAmount: number;
  fineAmount: number;
  abacusPaidAmount?: number | null;
  receivedDate: string | null;
  receiptDate: string | null;
  paymentMode: string | null;
  feeStructure: FeeStructure;
  feeTransactions: FeeTransaction[];
}

interface FeesTableContainerProps {
  studentId: string;
  mode: "collect" | "cancel";
}

const FeesTableContainer = async ({ studentId, mode }: FeesTableContainerProps) => {
  // 1. Fetch Student
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { Class: { include: { Grade: true } } },
  });

  if (!student) return <div>Student not found</div>;

  const gradeId = student.Class?.gradeId;
  if (!gradeId) return <div>Grade not found for student</div>;

  // 2. Fetch Fee Structures
  const feeStructures = await prisma.feeStructure.findMany({
    where: { gradeId },
    orderBy: { term: "asc" },
  });

  // 3. Fetch Student Fees
  const studentFees = await prisma.studentFees.findMany({
    where: { studentId },
    include: { feeTransactions: true },
  });

  // 4. Merge Data
  const transformedData: StudentFees[] = feeStructures.map((fee) => {
    const matchingPayment = studentFees.find((sf) => sf.feeStructureId === fee.id);
    return {
      id: matchingPayment?.id || 0,
      feeStructureId: fee.id,
      studentId,
      term: fee.term,
      paidAmount: matchingPayment?.paidAmount || 0,
      discountAmount: matchingPayment?.discountAmount || 0,
      fineAmount: matchingPayment?.fineAmount || 0,
      abacusPaidAmount: matchingPayment?.abacusPaidAmount || null,
      receivedDate: matchingPayment?.receivedDate ? matchingPayment.receivedDate.toISOString() : null,
      receiptDate: matchingPayment?.receiptDate ? matchingPayment.receiptDate.toISOString() : null,
      paymentMode: matchingPayment?.paymentMode || null,
      feeStructure: fee,
      feeTransactions: matchingPayment?.feeTransactions || [],
    };
  });

  // 5. Totals
  const totalFees = feeStructures.reduce((sum, f) => sum + f.termFees + (f.abacusFees || 0), 0);
  const totalPaid = transformedData.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDiscount = transformedData.reduce((sum, f) => sum + f.discountAmount, 0);
  const totalDue = totalFees - (totalPaid + totalDiscount);

  return (
    <div className="w-full">
      <h1 className="text-lg font-semibold mb-4">
        {mode === "collect" ? "Collect Fees" : "Cancel Fees"}
      </h1>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 mb-4 text-lg font-semibold">
        <div className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shadow">
          Total Fees: ₹{totalFees}
        </div>
        <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow">
          Total Paid: ₹{totalPaid}
        </div>
        <div className="px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 shadow">
          Total Discount: ₹{totalDiscount}
        </div>
        <div className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 shadow">
          Total Due: ₹{totalDue}
        </div>
      </div>

      {/* Client-side table */}
      <FeesTable data={transformedData} mode={mode} />
    </div>
  );
};

export default FeesTableContainer;
