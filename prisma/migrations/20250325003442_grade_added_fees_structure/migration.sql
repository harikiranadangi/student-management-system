/*
  Warnings:

  - You are about to drop the column `classId` on the `FeesStructure` table. All the data in the column will be lost.
  - Added the required column `gradeId` to the `FeesStructure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeesStructure" DROP CONSTRAINT "FeesStructure_classId_fkey";

-- AlterTable
ALTER TABLE "FeesStructure" DROP COLUMN "classId",
ADD COLUMN     "gradeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FeesStructure" ADD CONSTRAINT "FeesStructure_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
