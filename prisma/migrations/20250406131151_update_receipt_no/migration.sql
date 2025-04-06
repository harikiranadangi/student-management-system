/*
  Warnings:

  - You are about to drop the column `receiptNo` on the `FeeTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "receiptNo";

-- AlterTable
ALTER TABLE "StudentFees" ADD COLUMN     "receiptNo" TEXT;
