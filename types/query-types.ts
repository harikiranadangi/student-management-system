import { Prisma } from "@prisma/client";

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

export type StudentWithClass = Prisma.StudentGetPayload<{ select: typeof SingleStudentSelect }>;
