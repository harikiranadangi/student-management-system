/*
  Warnings:

  - You are about to drop the column `endTime` on the `exam` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `exam` table. All the data in the column will be lost.
  - Added the required column `date` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exam` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `date` DATETIME(3) NOT NULL;
