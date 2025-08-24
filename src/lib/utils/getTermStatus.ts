type GetTermStatusParams = {
  paidAmount: number;
  abacusAmount: number;
  totalFeeAmount: number;
  dueAmount: number;
  isPreKg?: boolean;
};

type TermStatusResult = { status: string; termsPaid: number };

export function getTermStatus({
  paidAmount,
  abacusAmount,
  totalFeeAmount,
  dueAmount,
  isPreKg = false,
}: GetTermStatusParams): TermStatusResult {
  const totalPaid = Math.min(paidAmount + abacusAmount, totalFeeAmount);

  // 🔹 Step 1: Define term structure dynamically
  const termFees = isPreKg
    ? // Pre-KG has only 2 terms
      [0, 0, totalFeeAmount / 2, totalFeeAmount / 2]
    : // Normal classes → second term includes abacus
      [
        (totalFeeAmount - abacusAmount) / 4, // Term 1
        totalFeeAmount / 4 + abacusAmount,   // Term 2
        (totalFeeAmount - abacusAmount) / 4, // Term 3
        (totalFeeAmount - abacusAmount) / 4, // Term 4
      ];

  // 🔹 Step 2: Compute how many terms are paid
  let cumulative = 0;
  let termsPaid = 0;
  for (const fee of termFees) {
    cumulative += fee;
    if (totalPaid >= cumulative) termsPaid++;
  }

  // 🔹 Step 3: Build status
  let status: string;
  if (dueAmount === 0) {
    status = "Fully Paid";
    termsPaid = isPreKg ? 2 : 4; // override just in case
  } else if (termsPaid === 0) {
    status = "Not Paid";
  } else {
    status = `${termsPaid} Term${termsPaid > 1 ? "s" : ""} Paid`;
  }

  return { status, termsPaid };
}
