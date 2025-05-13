/*
  Warnings:

  - You are about to drop the column `name` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Lesson_name_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "name";
