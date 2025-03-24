/*
  Warnings:

  - Added the required column `academicYear` to the `FeesStructure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `FeesStructure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `FeesStructure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `FeesStructure` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FeesStructure_classId_key";

-- AlterTable
ALTER TABLE "FeesStructure" ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "term" INTEGER NOT NULL,
ALTER COLUMN "abacusFees" DROP NOT NULL;
