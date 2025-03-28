/*
  Warnings:

  - You are about to drop the column `gradeId` on the `FeesCollection` table. All the data in the column will be lost.
  - You are about to drop the `StudentFee` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,term]` on the table `FeesCollection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classId` to the `FeesCollection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeePayment" DROP CONSTRAINT "FeePayment_studentFeeId_fkey";

-- DropForeignKey
ALTER TABLE "FeesCollection" DROP CONSTRAINT "FeesCollection_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_classId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_studentId_fkey";

-- DropIndex
DROP INDEX "FeesCollection_studentId_gradeId_term_key";

-- AlterTable
ALTER TABLE "FeesCollection" DROP COLUMN "gradeId",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "StudentFee";

-- CreateIndex
CREATE UNIQUE INDEX "FeesCollection_studentId_term_key" ON "FeesCollection"("studentId", "term");
