/*
  Warnings:

  - You are about to drop the `_teacherclasses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_teacherclasses` DROP FOREIGN KEY `_TeacherClasses_A_fkey`;

-- DropForeignKey
ALTER TABLE `_teacherclasses` DROP FOREIGN KEY `_TeacherClasses_B_fkey`;

-- DropIndex
DROP INDEX `Teacher_email_key` ON `teacher`;

-- AlterTable
ALTER TABLE `class` ADD COLUMN `supervisorId` INTEGER NULL;

-- DropTable
DROP TABLE `_teacherclasses`;

-- CreateIndex
CREATE UNIQUE INDEX `Class_name_key` ON `Class`(`name`);

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
