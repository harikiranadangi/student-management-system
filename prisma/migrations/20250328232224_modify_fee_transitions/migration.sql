/*
  Warnings:

  - You are about to drop the column `referenceId` on the `FeeTransaction` table. All the data in the column will be lost.
  - The `paymentMode` column on the `FeeTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `recieptDate` on the `StudentFees` table. All the data in the column will be lost.
  - You are about to drop the column `recievedDate` on the `StudentFees` table. All the data in the column will be lost.
  - Added the required column `receiptDate` to the `StudentFees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'ONLINE', 'UPI', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "referenceId",
DROP COLUMN "paymentMode",
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "StudentFees" DROP COLUMN "recieptDate",
DROP COLUMN "recievedDate",
ADD COLUMN     "receiptDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "PaymentMethod";
