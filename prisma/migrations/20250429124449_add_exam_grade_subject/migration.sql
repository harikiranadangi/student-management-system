/*
  Warnings:

  - You are about to drop the `ExamAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamGrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamAssignment" DROP CONSTRAINT "ExamAssignment_classId_fkey";

-- DropForeignKey
ALTER TABLE "ExamAssignment" DROP CONSTRAINT "ExamAssignment_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamGrade" DROP CONSTRAINT "ExamGrade_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamGrade" DROP CONSTRAINT "ExamGrade_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSubject" DROP CONSTRAINT "ExamSubject_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSubject" DROP CONSTRAINT "ExamSubject_subjectId_fkey";

-- DropTable
DROP TABLE "ExamAssignment";

-- DropTable
DROP TABLE "ExamGrade";

-- DropTable
DROP TABLE "ExamSubject";

-- CreateTable
CREATE TABLE "ExamGradeSubject" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "maxMarks" INTEGER NOT NULL,

    CONSTRAINT "ExamGradeSubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamGradeSubject_examId_gradeId_subjectId_key" ON "ExamGradeSubject"("examId", "gradeId", "subjectId");

-- AddForeignKey
ALTER TABLE "ExamGradeSubject" ADD CONSTRAINT "ExamGradeSubject_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGradeSubject" ADD CONSTRAINT "ExamGradeSubject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGradeSubject" ADD CONSTRAINT "ExamGradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
