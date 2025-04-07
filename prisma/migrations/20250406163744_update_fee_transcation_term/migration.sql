/*
  Warnings:

  - Changed the type of `term` on the `StudentFees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StudentFees" DROP COLUMN "term",
ADD COLUMN     "term" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_academicYear_term_key" ON "StudentFees"("studentId", "academicYear", "term");
