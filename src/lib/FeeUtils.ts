import { StudentFeesTable } from "../../types";

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString('en-GB').replace(/\//g, '-');
}

export function getTotalFees(fee: StudentFeesTable): number {
  return (fee.feeStructure?.termFees ?? 0) + (fee.feeStructure?.abacusFees ?? 0);
}

export function calculateDueAmount(fee: StudentFeesTable): number {
  return getTotalFees(fee) - (fee.paidAmount ?? 0) - (fee.discountAmount ?? 0) + (fee.fineAmount ?? 0);
}

export function getFeeStatus(fee: StudentFeesTable) {
  const dueAmount = calculateDueAmount(fee);
  const paidAmount = fee.paidAmount ?? 0;
  return {
    paidAmount,
    totalFees: getTotalFees(fee),
    isCollectDisabled: dueAmount <= 0,
    isZero: paidAmount === 0,
  };
}
