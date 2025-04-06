/*
  Warnings:

  - You are about to drop the column `receiptNo` on the `StudentFees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,term]` on the table `StudentFees` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentFees_studentId_term_receiptNo_key";

-- AlterTable
ALTER TABLE "StudentFees" DROP COLUMN "receiptNo";

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_term_key" ON "StudentFees"("studentId", "term");
