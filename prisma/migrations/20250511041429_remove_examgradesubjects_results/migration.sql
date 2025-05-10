/*
  Warnings:

  - You are about to drop the column `gradeId` on the `Result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_examId_gradeId_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_gradeId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "gradeId";
