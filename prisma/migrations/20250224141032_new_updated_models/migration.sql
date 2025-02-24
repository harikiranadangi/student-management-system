/*
  Warnings:

  - You are about to alter the column `amount` on the `fee` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `score` on the `result` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `_subjecttoteacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `feesbook` to the `Fee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_subjecttoteacher` DROP FOREIGN KEY `_subjecttoteacher_A_fkey`;

-- DropForeignKey
ALTER TABLE `_subjecttoteacher` DROP FOREIGN KEY `_subjecttoteacher_B_fkey`;

-- DropForeignKey
ALTER TABLE `announcement` DROP FOREIGN KEY `Announcement_classId_fkey`;

-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_gradeId_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_supervisorId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_classId_fkey`;

-- DropForeignKey
ALTER TABLE `exam` DROP FOREIGN KEY `Exam_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `fee` DROP FOREIGN KEY `Fee_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_classId_fkey`;

-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `Result_assignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `Result_examId_fkey`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `Result_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_classId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_gradeId_fkey`;

-- AlterTable
ALTER TABLE `fee` ADD COLUMN `feesbook` VARCHAR(191) NOT NULL,
    MODIFY `amount` INTEGER NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `result` MODIFY `score` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `_subjecttoteacher`;

-- CreateTable
CREATE TABLE `_TeacherSubject` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TeacherSubject_AB_unique`(`A`, `B`),
    INDEX `_TeacherSubject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fee` ADD CONSTRAINT `Fee_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TeacherSubject` ADD CONSTRAINT `_TeacherSubject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TeacherSubject` ADD CONSTRAINT `_TeacherSubject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `announcement` RENAME INDEX `Announcement_classId_fkey` TO `Announcement_classId_idx`;

-- RenameIndex
ALTER TABLE `assignment` RENAME INDEX `Assignment_lessonId_fkey` TO `Assignment_lessonId_idx`;

-- RenameIndex
ALTER TABLE `attendance` RENAME INDEX `Attendance_studentId_fkey` TO `Attendance_studentId_idx`;

-- RenameIndex
ALTER TABLE `class` RENAME INDEX `Class_gradeId_fkey` TO `Class_gradeId_idx`;

-- RenameIndex
ALTER TABLE `class` RENAME INDEX `Class_supervisorId_fkey` TO `Class_supervisorId_idx`;

-- RenameIndex
ALTER TABLE `event` RENAME INDEX `Event_classId_fkey` TO `Event_classId_idx`;

-- RenameIndex
ALTER TABLE `exam` RENAME INDEX `Exam_lessonId_fkey` TO `Exam_lessonId_idx`;

-- RenameIndex
ALTER TABLE `lesson` RENAME INDEX `Lesson_classId_fkey` TO `Lesson_classId_idx`;

-- RenameIndex
ALTER TABLE `lesson` RENAME INDEX `Lesson_subjectId_fkey` TO `Lesson_subjectId_idx`;

-- RenameIndex
ALTER TABLE `lesson` RENAME INDEX `Lesson_teacherId_fkey` TO `Lesson_teacherId_idx`;

-- RenameIndex
ALTER TABLE `result` RENAME INDEX `Result_assignmentId_fkey` TO `Result_assignmentId_idx`;

-- RenameIndex
ALTER TABLE `result` RENAME INDEX `Result_examId_fkey` TO `Result_examId_idx`;

-- RenameIndex
ALTER TABLE `result` RENAME INDEX `Result_studentId_fkey` TO `Result_studentId_idx`;

-- RenameIndex
ALTER TABLE `student` RENAME INDEX `Student_gradeId_fkey` TO `Student_gradeId_idx`;
