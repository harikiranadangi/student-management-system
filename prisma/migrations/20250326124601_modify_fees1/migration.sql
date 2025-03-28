/*
  Warnings:

  - A unique constraint covering the columns `[studentId,term,academicYear]` on the table `FeesCollection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FeesCollection_studentId_term_key";

-- CreateIndex
CREATE UNIQUE INDEX "FeesCollection_studentId_term_academicYear_key" ON "FeesCollection"("studentId", "term", "academicYear");
