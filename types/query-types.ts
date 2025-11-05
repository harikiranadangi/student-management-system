import { Prisma } from "@prisma/client";

// -------------------------------
// 🔹 SELECT (lightweight version)
// -------------------------------
export const StudentSelect = {
  id: true,
  name: true,
  gender: true,
  status: true,
  classId: true,
  fatherName: true,
  phone: true,
  dob: true,
  img: true,
  Class: {
    select: {
      id: true,
      section: true,
      gradeId: true,
      Grade: {
        select: {
          level: true,
        },
      },
    },
  },
} satisfies Prisma.StudentSelect;

export type StudentMinimal = Prisma.StudentGetPayload<{
  select: typeof StudentSelect;
}>;

export const SingleStudentSelect = {
  id: true,
  name: true,
  gender: true,
  dob: true,
  email: true,
  phone: true,
  img: true,
  bloodType: true,
  classId: true,
  attendances: {
    select: { date: true, present: true },
  },
  Class: {
    select: {
      id: true,
      section: true,
      gradeId: true,
      Grade: { select: { id: true, level: true } },
      Teacher: { select: { id: true, name: true } },
      _count: { select: { lessons: true } },
    },
  },
} satisfies Prisma.StudentSelect;

export type StudentWithClass = Prisma.StudentGetPayload<{
  select: typeof SingleStudentSelect;
}>;

// * Query Params for Fees Management Page

export const FeeGradeSelect = {
  id: true,
  level: true,
  feestructure: {
    select: {
      id: true,
      term: true,
      termFees: true,
      abacusFees: true,
      startDate: true,
      dueDate: true,
      academicYear: true,
    },
  },
} satisfies Prisma.GradeSelect;

export type GradeWithFees = Prisma.GradeGetPayload<{
  select: typeof FeeGradeSelect;
}>;
