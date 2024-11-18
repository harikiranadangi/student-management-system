/*
  Warnings:

  - You are about to drop the `_classtosubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_lessonassignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_lessonattendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_lessonexams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_classtosubject` DROP FOREIGN KEY `_ClassToSubject_A_fkey`;

-- DropForeignKey
ALTER TABLE `_classtosubject` DROP FOREIGN KEY `_ClassToSubject_B_fkey`;

-- DropForeignKey
ALTER TABLE `_lessonassignments` DROP FOREIGN KEY `_LessonAssignments_A_fkey`;

-- DropForeignKey
ALTER TABLE `_lessonassignments` DROP FOREIGN KEY `_LessonAssignments_B_fkey`;

-- DropForeignKey
ALTER TABLE `_lessonattendances` DROP FOREIGN KEY `_LessonAttendances_A_fkey`;

-- DropForeignKey
ALTER TABLE `_lessonattendances` DROP FOREIGN KEY `_LessonAttendances_B_fkey`;

-- DropForeignKey
ALTER TABLE `_lessonexams` DROP FOREIGN KEY `_LessonExams_A_fkey`;

-- DropForeignKey
ALTER TABLE `_lessonexams` DROP FOREIGN KEY `_LessonExams_B_fkey`;

-- DropTable
DROP TABLE `_classtosubject`;

-- DropTable
DROP TABLE `_lessonassignments`;

-- DropTable
DROP TABLE `_lessonattendances`;

-- DropTable
DROP TABLE `_lessonexams`;

-- CreateTable
CREATE TABLE `_ExamLessons` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExamLessons_AB_unique`(`A`, `B`),
    INDEX `_ExamLessons_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AssignmentLessons` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AssignmentLessons_AB_unique`(`A`, `B`),
    INDEX `_AssignmentLessons_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttendanceLessons` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AttendanceLessons_AB_unique`(`A`, `B`),
    INDEX `_AttendanceLessons_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Subject_name_key` ON `Subject`(`name`);

-- AddForeignKey
ALTER TABLE `_ExamLessons` ADD CONSTRAINT `_ExamLessons_A_fkey` FOREIGN KEY (`A`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExamLessons` ADD CONSTRAINT `_ExamLessons_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignmentLessons` ADD CONSTRAINT `_AssignmentLessons_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignmentLessons` ADD CONSTRAINT `_AssignmentLessons_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttendanceLessons` ADD CONSTRAINT `_AttendanceLessons_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttendanceLessons` ADD CONSTRAINT `_AttendanceLessons_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
