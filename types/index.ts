// types/index.ts

import { FeeTransaction } from "@prisma/client";

export type FeeStructure = {
  id: number;
  gradeId: number;
  startDate: string; // or Date, based on usage
  dueDate: string;   // ✅ Add this line
  termFees: number;
  abacusFees: number | null;
  term: string;      // Or enum Term if you have it
  academicYear: string; // Or enum if defined
};

// Define individual StudentFees entry
export type StudentFees = {
  paidAmount?: number;
  discountAmount?: number;
  fineAmount?: number; // fineAmount missing earlier, added it
  feeStructure?: FeeStructure; // studentFees can have feeStructure
};

// Define StudentTotalFees entry
export type StudentTotalFees = {
  id: number;
  studentId: string;
  totalPaidAmount: number;
  totalDiscountAmount: number;
  totalFineAmount: number;
  totalAbacusAmount: number;
  totalFeeAmount: number;
  dueAmount: number;
  status: string; // like "Paid", "Partial", "Not Paid"
};

// Full student report model
export type StudentFeeReportList = {
  id: string;
  name: string;
  username: string;
  parentName: string | null;
  img: string | null;
  dob: string;
  phone: string | null;
  gender: string | null;
  
  studentFees?: StudentFees[]; // multiple studentFees with feeStructure inside
  studentTotalFees?: StudentTotalFees | null; // total fees, optional

  Class?: {
    name: string;
    Grade?: {
      name: string;
      feestructure?: FeeStructure[]; // grade-wise feeStructure
    };
  };
};

// types.ts
export type MessageType = "ABSENT" | "FEE_RELATED" | "ANNOUNCEMENT" | "GENERAL" | "FEE_COLLECTION";

export type CurrentState = { success: boolean; error: boolean, };


// types.ts
export type SearchParams = { [key: string]: string | string[] | undefined };

export type PageProps = { searchParams?: SearchParams };

export interface StudentFeesTable {
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
  paymentMode: string;
  feeStructure: FeeStructure;
  feeTransactions: FeeTransaction[];
  collectedAmount?: number;
  receiptNo?: string | null;
  remarks?: string | null;
  updatedByName?: string | null;
}

export type Mode = "collect" | "cancel";


