/*
  Warnings:

  - You are about to drop the column `dueDate` on the `homework` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `_homeworktostudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Date` to the `Homework` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_homeworktostudent` DROP FOREIGN KEY `_HomeworkToStudent_A_fkey`;

-- DropForeignKey
ALTER TABLE `_homeworktostudent` DROP FOREIGN KEY `_HomeworkToStudent_B_fkey`;

-- DropForeignKey
ALTER TABLE `announcement` DROP FOREIGN KEY `Announcement_classId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_classId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_gradeId_fkey`;

-- DropIndex
DROP INDEX `Student_gradeId_idx` ON `student`;

-- AlterTable
ALTER TABLE `homework` DROP COLUMN `dueDate`,
    ADD COLUMN `Date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `gradeId`;

-- DropTable
DROP TABLE `_homeworktostudent`;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
