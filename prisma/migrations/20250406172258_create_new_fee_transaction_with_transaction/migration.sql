/*
  Warnings:

  - You are about to drop the `FeeTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeeTransaction" DROP CONSTRAINT "FeeTransaction_studentFeesId_fkey";

-- DropForeignKey
ALTER TABLE "FeeTransaction" DROP CONSTRAINT "FeeTransaction_studentId_fkey";

-- DropTable
DROP TABLE "FeeTransaction";

-- CreateTable
CREATE TABLE "NewFeeTransaction" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "studentFeesId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "fineAmount" DOUBLE PRECISION NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "receiptNo" TEXT NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewFeeTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewFeeTransaction" ADD CONSTRAINT "NewFeeTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewFeeTransaction" ADD CONSTRAINT "NewFeeTransaction_studentFeesId_fkey" FOREIGN KEY ("studentFeesId") REFERENCES "StudentFees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
