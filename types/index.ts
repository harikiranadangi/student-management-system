// types/index.ts

import {
  AcademicYear,
  Announcement,
  Attendance,
  Class,
  Exam,
  FeeTransaction,
  Grade,
  Homework,
  Messages,
  PaymentMode,
  Student,
} from "@prisma/client";

export type FeeStructure = {
  id: number;
  gradeId: number;
  startDate: string; // or Date, based on usage
  dueDate: string; // ✅ Add this line
  termFees: number;
  abacusFees: number | null;
  term: string; // Or enum Term if you have it
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
  fatherName: string | null;
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
export type MessageType =
  | "ABSENT"
  | "FEE_RELATED"
  | "ANNOUNCEMENT"
  | "GENERAL"
  | "FEE_COLLECTION";

export type CurrentState = { success: boolean; error: boolean };

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

// types/index.ts
export type SafeUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string;
  email?: string;
  role?: string | null; // make role flexible
};

export const dropdownUI =
  "w-full py-2 pl-4 pr-10 text-sm rounded-full appearance-none md:w-auto " +
  "border border-gray-300 text-gray-700 bg-white " +
  "focus:ring-2 focus:ring-LamaSky focus:outline-none " +
  "dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800";

export interface StudentFee {
  id: number;
  studentId: string;
  term: string;
  paidAmount: number;
  discountAmount: number;
  fineAmount: number;
  receiptDate?: string;
  receiptNo?: string;
  remarks?: string;
  paymentMode: PaymentMode;
  academicYear: AcademicYear; // ✅ add this line
  feeStructure?: {
    id: number;
    termFees?: number;
    abacusFees?: number;
    dueDate?: string;
  };
  feeTransactions?: {
    receiptNo?: string;
    remarks?: string;
  }[];
}

export type PermissionWithRelations = {
  id: number;
  timeIssued: Date;
  date: Date;
  leaveType: string;
  description: string | null;
  withWhom: string | null;
  relation: string | null;
  studentId: string;

  student: {
    id: string;
    name: string;
    classId: number;
    Class: {
      id: number;
      section: string | null;
      gradeId: number;
      Grade: {
        id: number;
        level: string;
      };
    };
  };
};

export type Props = {
  data: {
    id: number;
    date: Date;
    leaveType: string;
    description: string | null;
    timeIssued: Date;
    withWhom: string | null;
    relation: string | null;
    student: {
      id: string;
      name: string;
      classId: number;
      Class: {
        id: number;
        section: string | null;
        gradeId: number;
        Grade: {
          id: number;
          level: string;
        };
      };
    };
  }[];
  fileName: string;
};

export type AnnouncementList = Announcement & { Class: Class };

export type AttendanceResponse = {
  attendance: Attendance[];
  students: (Student & { Class: Class })[];
};

export type ClassList = {
  id: number;
  section: string | null;
  gradeId: number;
  Grade: {
    id: number;
    level: string;
  };
  Teacher: {
    id: string;
    name: string;
    classId: number;
  } | null;
};

export type Events = Event & { class: Class };

export type Exams = Exam & {
  examGradeSubjects: {
    date: Date;
    startTime: string;
    maxMarks: number;
    Grade: { id: number; level: string };
    Subject: { id: number; name: string };
  }[];
};

export type StudentList = {
  id: string;
  name: string;
  gender: string;
  fatherName: string | null;
  phone: string;
  img?: string | null;
  Class?: { name: string | null } | null;
  totalFees?: { totalDiscountAmount: number | null } | null;
};

export type StudentsList = Student & {
  Class: {
    id: number;
    section: string | null;
    gradeId: number;
    Grade: {
      level: string;
    };
  };
};


export type FeesList = Grade & {
  feestructure: FeeStructure[];
};

// Types
export type StudentsFeeReportList = {
  id: string;
  name: string;
  username: string;
  fatherName: string | null;
  img: string | null;
  dob: string;
  phone: string | null;
  gender: string | null;
  studentFees?: (StudentFees & { feeStructure?: FeeStructure })[];
  studentTotalFees?: StudentTotalFees | null;
  Class?: {
    name: string;
    Grade?: {
      name: string;
      feestructure?: FeeStructure[];
    };
  };
};

export type Homeworks = Homework & {
  Class: {
    id: number;
    gradeId: number;
    section: string | null;
    Grade: {
      id: number;
      level: string;
    };
  };
};

export type MessageList = Messages & {
  Student: {
    id: string;
    name: string;
  } | null;
  Class: {
    id: number;
    section: string | null;
    gradeId: number;
    Grade: {
      id: number;
      level: string;
    };
  } | null;
};