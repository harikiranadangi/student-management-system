/*
  Warnings:

  - You are about to drop the column `paymentMode` on the `FeeTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "paymentMode";

-- AlterTable
ALTER TABLE "StudentFees" ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH';
