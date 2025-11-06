import React from "react";
import prisma from "@/lib/prisma";
import FeesTable from "./FeesTable";
import { StudentFee } from "../../../types";
import { AcademicYear } from "@prisma/client";

interface FeesTableContainerProps {
  studentId: string;
  mode: "collect" | "cancel";
}

const FeesTableContainer = async ({
  studentId,
  mode,
}: FeesTableContainerProps) => {
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
  const transformedData: StudentFee[] = feeStructures.map((fee) => {
    const matchingPayment = studentFees.find(
      (sf) => sf.feeStructureId === fee.id
    );

    return {
      id: matchingPayment?.id || 0,
      academicYear: fee.academicYear as AcademicYear,
      feeStructureId: fee.id,
      studentId,
      term: fee.term,
      paidAmount: matchingPayment?.paidAmount || 0,
      discountAmount: matchingPayment?.discountAmount || 0,
      fineAmount: matchingPayment?.fineAmount || 0,
      abacusPaidAmount: matchingPayment?.abacusPaidAmount ?? null,
      receiptDate: matchingPayment?.receiptDate?.toISOString() ?? undefined, // ✅ changed
      receiptNo: matchingPayment?.receiptNo ?? undefined, // ✅ added for completeness
      remarks: matchingPayment?.remarks ?? undefined, // ✅ added
      paymentMode: matchingPayment?.paymentMode ?? "CASH", // ✅ always a valid PaymentMode
      feeStructure: {
        id: fee.id,
        termFees: fee.termFees ?? 0,
        abacusFees: fee.abacusFees ?? 0,
        dueDate: fee.dueDate?.toISOString?.() ?? undefined, // ✅ changed
      },
      feeTransactions:
        matchingPayment?.feeTransactions?.map((tx) => ({
          receiptNo: tx.receiptNo ?? undefined,
          remarks: tx.remarks ?? undefined,
        })) ?? [],
    };
  });

  // 5. Totals
  const totalFees = feeStructures.reduce(
    (sum, f) => sum + f.termFees + (f.abacusFees || 0),
    0
  );
  const totalPaid = transformedData.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDiscount = transformedData.reduce(
    (sum, f) => sum + f.discountAmount,
    0
  );
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
