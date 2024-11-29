/*
  Warnings:

  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_subjecttoteacher` DROP FOREIGN KEY `_SubjectToTeacher_B_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_supervisorId_fkey`;

-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_teacherId_fkey`;

-- AlterTable
ALTER TABLE `_subjecttoteacher` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `class` MODIFY `supervisorId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `lesson` MODIFY `teacherId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SubjectToTeacher` ADD CONSTRAINT `_SubjectToTeacher_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
