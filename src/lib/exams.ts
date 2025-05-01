// lib/exams.ts
import prisma from "@/lib/prisma";

export async function getExamsForDate(date: string) {
  if (!date) throw new Error("Date is required");

  const examDate = new Date(date);

  return prisma.exam.findMany({
    where: {
      date: {
        gte: new Date(examDate.setHours(0, 0, 0, 0)),
        lt: new Date(examDate.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      examGradeSubjects: {
        include: {
          Grade: true,
          Subject: true,
        },
      },
    },
  });
}
