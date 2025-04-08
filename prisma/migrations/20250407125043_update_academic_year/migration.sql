/*
  Warnings:

  - The `academicYear` column on the `FeeStructure` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FeeStructure" DROP COLUMN "academicYear",
ADD COLUMN     "academicYear" "AcademicYear" NOT NULL DEFAULT 'Y2024_2025';

-- AlterTable
ALTER TABLE "StudentFees" ALTER COLUMN "academicYear" SET DEFAULT 'Y2024_2025';

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_gradeId_term_academicYear_key" ON "FeeStructure"("gradeId", "term", "academicYear");
