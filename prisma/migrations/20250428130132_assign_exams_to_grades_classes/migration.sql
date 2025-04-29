/*
  Warnings:

  - You are about to drop the column `classId` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `gradeId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_classId_fkey";

-- DropIndex
DROP INDEX "Exam_classId_idx";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "classId",
ADD COLUMN     "gradeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ExamAssignment" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "ExamAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamAssignment_examId_classId_key" ON "ExamAssignment"("examId", "classId");

-- CreateIndex
CREATE INDEX "Exam_gradeId_idx" ON "Exam"("gradeId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAssignment" ADD CONSTRAINT "ExamAssignment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAssignment" ADD CONSTRAINT "ExamAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
