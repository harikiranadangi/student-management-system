/*
  Warnings:

  - You are about to drop the column `parentName` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "parentName",
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "motherName" TEXT;
