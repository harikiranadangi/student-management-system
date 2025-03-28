/*
  Warnings:

  - You are about to drop the column `abacusPaid` on the `StudentFees` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `StudentFees` table. All the data in the column will be lost.
  - Added the required column `feeStructureId` to the `StudentFees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recieptDate` to the `StudentFees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `StudentFees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentFees" DROP COLUMN "abacusPaid",
DROP COLUMN "paymentDate",
ADD COLUMN     "abacusPaidAmount" INTEGER,
ADD COLUMN     "feeStructureId" INTEGER NOT NULL,
ADD COLUMN     "recieptDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "recievedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "term" "Term" NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentFees" ADD CONSTRAINT "StudentFees_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "FeeStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
