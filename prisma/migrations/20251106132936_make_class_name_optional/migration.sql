/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `class` will be added. If there are existing duplicate values, this will fail.
  - Made the column `section` on table `class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "class" ADD COLUMN     "name" TEXT,
ALTER COLUMN "section" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "class_name_key" ON "class"("name");
