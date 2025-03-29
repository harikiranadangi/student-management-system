/*
  Warnings:

  - A unique constraint covering the columns `[studentId,term,fbNumber]` on the table `StudentFees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_term_fbNumber_key" ON "StudentFees"("studentId", "term", "fbNumber");
