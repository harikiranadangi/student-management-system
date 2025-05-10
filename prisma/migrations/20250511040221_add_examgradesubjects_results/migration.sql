/*
  Warnings:

  - Added the required column `gradeId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "gradeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_examId_gradeId_subjectId_fkey" FOREIGN KEY ("examId", "gradeId", "subjectId") REFERENCES "ExamGradeSubject"("examId", "gradeId", "subjectId") ON DELETE CASCADE ON UPDATE CASCADE;
