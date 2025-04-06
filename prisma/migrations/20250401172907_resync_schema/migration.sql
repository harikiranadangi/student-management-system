/*
  Warnings:

  - A unique constraint covering the columns `[studentId,term]` on the table `StudentFees` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FeeTransaction_fbNumber_key";

-- DropIndex
DROP INDEX "StudentFees_fbNumber_key";

-- DropIndex
DROP INDEX "StudentFees_studentId_term_fbNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_term_key" ON "StudentFees"("studentId", "term");
