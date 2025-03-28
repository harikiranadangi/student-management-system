/*
  Warnings:

  - A unique constraint covering the columns `[gradeId,term,academicYear]` on the table `FeeStructure` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FeeStructure_gradeId_term_key";

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_gradeId_term_academicYear_key" ON "FeeStructure"("gradeId", "term", "academicYear");
