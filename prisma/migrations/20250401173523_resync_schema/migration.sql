/*
  Warnings:

  - You are about to drop the column `fbNumber` on the `FeeTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `fbNumber` on the `StudentFees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,term,receiptNo]` on the table `StudentFees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiptNo` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptNo` to the `StudentFees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "StudentFees_studentId_term_key";

-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "fbNumber",
ADD COLUMN     "receiptNo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudentFees" DROP COLUMN "fbNumber",
ADD COLUMN     "receiptNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_term_receiptNo_key" ON "StudentFees"("studentId", "term", "receiptNo");
