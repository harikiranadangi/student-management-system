type GetTermStatusParams = {
    paidAmount: number;
    abacusAmount: number;
    totalFeeAmount: number;
    dueAmount: number;
    isPreKg?: boolean; // 👈 New optional flag
  };
  
  type TermStatusResult = { status: string; termsPaid: number };
  
  export function getTermStatus({ paidAmount, abacusAmount, totalFeeAmount, dueAmount, isPreKg = false }: GetTermStatusParams): TermStatusResult {
    const totalPaid = Math.min(paidAmount + abacusAmount, totalFeeAmount);
  
    if (isPreKg) {
      // Special case for Pre KG
      const termFee = totalFeeAmount / 2; // 3rd and 4th term only
      const termFees = [0, 0, termFee, termFee]; // 1st and 2nd terms are zero
  
      const termsPaid = dueAmount === 0 ? 2 : totalPaid <= 0 ? 0 : termFees.reduce(
        (count, fee, i) =>
          totalPaid >= termFees.slice(0, i + 1).reduce((a, b) => a + b, 0)
            ? count + 1
            : count,
        0
      );
  
      const status = termsPaid === 2
        ? "Fully Paid"
        : termsPaid === 0
        ? "Not Paid"
        : `${termsPaid} Term${termsPaid > 1 ? "s" : ""} Paid`;
  
      return { status, termsPaid };
    } else {
      // Normal classes
      const normalTermFee = (totalFeeAmount - abacusAmount) / 4;
      const secondTermFee = (totalFeeAmount / 4) + abacusAmount;
      const termFees = [normalTermFee, secondTermFee, normalTermFee, normalTermFee];
  
      const termsPaid = dueAmount === 0 ? 4 : totalPaid <= 0 ? 0 : termFees.reduce(
        (count, fee, i) =>
          totalPaid >= termFees.slice(0, i + 1).reduce((a, b) => a + b, 0)
            ? count + 1
            : count,
        0
      );
  
      const status = termsPaid === 4
        ? "Fully Paid"
        : termsPaid === 0
        ? "Not Paid"
        : `${termsPaid} Term${termsPaid > 1 ? "s" : ""} Paid`;
  
      return { status, termsPaid };
    }
  }
  