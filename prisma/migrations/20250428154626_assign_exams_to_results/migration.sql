/*
  Warnings:

  - You are about to drop the column `score` on the `Result` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,examId,subjectId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marks` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Result_examId_idx";

-- DropIndex
DROP INDEX "Result_studentId_idx";

-- DropIndex
DROP INDEX "Result_subjectId_idx";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "score",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "marks" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Result_studentId_examId_subjectId_key" ON "Result"("studentId", "examId", "subjectId");
