/*
  Warnings:

  - You are about to drop the column `feesBookNumber` on the `FeeTransaction` table. All the data in the column will be lost.
  - You are about to drop the `FeesCollection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fbNumber]` on the table `FeeTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fbNumber` to the `FeeTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeesCollection" DROP CONSTRAINT "FeesCollection_feesStructureId_fkey";

-- DropForeignKey
ALTER TABLE "FeesCollection" DROP CONSTRAINT "FeesCollection_studentId_fkey";

-- DropIndex
DROP INDEX "FeeTransaction_feesBookNumber_key";

-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "feesBookNumber",
ADD COLUMN     "discountGiven" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fbNumber" TEXT NOT NULL,
ADD COLUMN     "fineCollected" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StudentFees" ADD COLUMN     "discountAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fineAmount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "paidAmount" SET DEFAULT 0;

-- DropTable
DROP TABLE "FeesCollection";

-- CreateIndex
CREATE UNIQUE INDEX "FeeTransaction_fbNumber_key" ON "FeeTransaction"("fbNumber");
