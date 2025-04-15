import { StudentWithFees } from "../../types";

// Function to calculate total fees from student's Grade feestructure
export function calculateTotalFees(student: StudentWithFees) {
    return student?.Class?.Grade?.feestructure?.reduce((sum: number, fee: any) => {
      return sum + (fee.termFees ?? 0) + (fee.abacusFees ?? 0);
    }, 0) || 0;
  }
  
  // Function to calculate total paid amount (including abacus fees)
  export function calculateTotalPaidAmount(student: StudentWithFees) {
    const totalPaid = student?.StudentTotalFees?.totalPaidAmount ?? 0;
    const totalAbacus = student?.StudentTotalFees?.totalAbacusAmount ?? 0;
    return totalPaid + totalAbacus;
  }
  
  // Function to calculate total discount amount
  export function calculateTotalDiscountAmount(student: StudentWithFees) {
    return student?.StudentTotalFees?.totalDiscountAmount ?? 0;
  }
  
  // Function to calculate due amount
  export function calculateDueAmount(student: StudentWithFees) {
    const totalFees = calculateTotalFees(student);
    const totalPaidAmount = calculateTotalPaidAmount(student);
    const totalDiscountAmount = calculateTotalDiscountAmount(student);
    return totalFees - totalPaidAmount - totalDiscountAmount;
  }
  