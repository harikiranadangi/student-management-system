/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_studentId_fkey";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "FeeTransaction" (
    "id" SERIAL NOT NULL,
    "studentFeesId" INTEGER NOT NULL,
    "feesBookNumber" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMode" TEXT NOT NULL,
    "referenceId" TEXT,

    CONSTRAINT "FeeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeeTransaction_feesBookNumber_key" ON "FeeTransaction"("feesBookNumber");

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentFeesId_fkey" FOREIGN KEY ("studentFeesId") REFERENCES "StudentFees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
