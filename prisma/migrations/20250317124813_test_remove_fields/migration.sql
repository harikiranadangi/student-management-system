/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Homework` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Homework` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_subjectId_fkey";

-- DropIndex
DROP INDEX "Homework_subjectId_idx";

-- AlterTable
ALTER TABLE "Homework" DROP COLUMN "subjectId",
DROP COLUMN "title";
