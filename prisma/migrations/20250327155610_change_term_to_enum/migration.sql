/*
  Warnings:

  - You are about to drop the column `term` on the `StudentFees` table. All the data in the column will be lost.
  - Changed the type of `term` on the `FeeStructure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Term" AS ENUM ('TERM_1', 'TERM_2', 'TERM_3', 'TERM_4');

-- AlterTable
ALTER TABLE "FeeStructure" DROP COLUMN "term",
ADD COLUMN     "term" "Term" NOT NULL;

-- AlterTable
ALTER TABLE "StudentFees" DROP COLUMN "term";

-- DropEnum
DROP TYPE "FeeTerm";

-- DropEnum
DROP TYPE "termspaid";

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_gradeId_term_key" ON "FeeStructure"("gradeId", "term");
