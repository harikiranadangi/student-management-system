/*
  Warnings:

  - You are about to drop the column `lessonId` on the `exam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_lessonId_fkey`;

-- DropIndex
DROP INDEX `Exam_lessonId_idx` ON `exam`;

-- AlterTable
ALTER TABLE `exam` DROP COLUMN `lessonId`;

-- RenameIndex
ALTER TABLE `exam` RENAME INDEX `Exam_classId_fkey` TO `Exam_classId_idx`;
