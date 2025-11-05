-- AlterTable
ALTER TABLE "FeeTransaction" ADD COLUMN     "academicYear" "AcademicYear" NOT NULL DEFAULT 'Y2024_2025';

-- CreateIndex
CREATE INDEX "FeeTransaction_studentId_academicYear_idx" ON "FeeTransaction"("studentId", "academicYear");
