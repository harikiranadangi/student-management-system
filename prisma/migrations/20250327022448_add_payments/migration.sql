/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `datePaid` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `FeePayment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_classId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_studentId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amountPaid",
DROP COLUMN "classId",
DROP COLUMN "datePaid",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "FeePayment";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_studentId_key" ON "Payment"("studentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
