/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `teacher` MODIFY `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_email_key` ON `Teacher`(`email`);
