import React from "react";
import FeesTable from "./FeesTable";
import prisma from "@/lib/prisma";
import { FeeStructure, FeeTransaction } from "@prisma/client";

interface StudentFees {
  id: number; // <-- required
  feeStructureId: number;
  studentId: string;
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
  studentId: string; // <-- Required here
  mode: "collect" | "cancel"; // <-- Required here
}

const FeesTableContainer = async ({ studentId, mode }: FeesTableContainerProps) => {
  // Step 1: Fetch Student
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      Class: {
        include: {
          Grade: true,
        },
      },
    },
  });

  if (!student) {
    return <div>Student not found</div>;
  }

  const gradeId = student.Class?.gradeId;

  if (!gradeId) {
    return <div>Grade not found for student</div>;
  }

  // Step 2: Fetch Fee Structures
  const feeStructures = await prisma.feeStructure.findMany({
    where: { gradeId },
    orderBy: { term: "asc" },
  });

  // Step 3: Fetch Student Fees
  const studentFees = await prisma.studentFees.findMany({
    where: { studentId },
    include: {
      feeTransactions: true,
    },
  });

  // Step 4: Merge Data
  const transformedData: StudentFees[] = feeStructures.map((fee) => {
    const matchingPayment = studentFees.find((sf) => sf.feeStructureId === fee.id);

    return {
      id: matchingPayment?.id || 0, // <- FIXED: Provide id
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

  // Step 5: Calculate Total Paid Fees
  // --- Calculations ---
  const totalFees = feeStructures.reduce((sum, fee) => sum + fee.termFees + (fee.abacusFees || 0), 0);
  const totalPaid = transformedData.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalDiscount = transformedData.reduce((sum, fee) => sum + fee.discountAmount, 0);
  const totalDue = totalFees - (totalPaid + totalDiscount);

  return (
    <div className="w-full table-fixed border-collapse">
      <h1 className="text-lg font-semibold mb-4">
        {mode === "collect" ? "Collect Fees" : "Cancel Fees"}</h1>
      <h1 className="text-xl  mb-4">Total Fees: {totalFees} | Total Paid: {totalPaid} | Total Discount: {totalDiscount} | Total Due: {totalDue}</h1>
      <FeesTable data={transformedData as any}  mode={mode}/>
    </div>
  );
};

export default FeesTableContainer;
