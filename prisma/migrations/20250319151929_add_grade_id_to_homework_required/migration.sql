/*
  Warnings:

  - Made the column `gradeId` on table `Homework` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_gradeId_fkey";

-- AlterTable
ALTER TABLE "Homework" ALTER COLUMN "gradeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
