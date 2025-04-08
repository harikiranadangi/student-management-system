/*
  Warnings:

  - You are about to drop the `NewFeeTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NewFeeTransaction" DROP CONSTRAINT "NewFeeTransaction_studentFeesId_fkey";

-- DropForeignKey
ALTER TABLE "NewFeeTransaction" DROP CONSTRAINT "NewFeeTransaction_studentId_fkey";

-- AlterTable
ALTER TABLE "StudentFees" ALTER COLUMN "receivedDate" DROP NOT NULL;

-- DropTable
DROP TABLE "NewFeeTransaction";

-- CreateTable
CREATE TABLE "FeeTransaction" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "studentFeesId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "receiptNo" TEXT NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentFeesId_fkey" FOREIGN KEY ("studentFeesId") REFERENCES "StudentFees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
