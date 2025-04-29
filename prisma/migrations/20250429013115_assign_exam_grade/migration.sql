/*
  Warnings:

  - You are about to drop the column `gradeId` on the `Exam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_gradeId_fkey";

-- DropIndex
DROP INDEX "Exam_gradeId_idx";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "gradeId";

-- CreateTable
CREATE TABLE "ExamGrade" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "ExamGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamGrade_examId_gradeId_key" ON "ExamGrade"("examId", "gradeId");

-- AddForeignKey
ALTER TABLE "ExamGrade" ADD CONSTRAINT "ExamGrade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGrade" ADD CONSTRAINT "ExamGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
