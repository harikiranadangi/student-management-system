/*
  Warnings:

  - You are about to drop the column `discountGiven` on the `FeeTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `fineCollected` on the `FeeTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `FeeTransaction` table. All the data in the column will be lost.
  - Added the required column `amount` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountAmount` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fineAmount` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMode` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptDate` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `receiptNo` on table `FeeTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "discountGiven",
DROP COLUMN "fineCollected",
DROP COLUMN "paymentDate",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fineAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentMode" TEXT NOT NULL,
ADD COLUMN     "receiptDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "term" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amountPaid" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "receiptNo" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
