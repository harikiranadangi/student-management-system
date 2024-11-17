/*
  Warnings:

  - You are about to drop the `_teachersubjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_teachersubjects` DROP FOREIGN KEY `_TeacherSubjects_A_fkey`;

-- DropForeignKey
ALTER TABLE `_teachersubjects` DROP FOREIGN KEY `_TeacherSubjects_B_fkey`;

-- DropTable
DROP TABLE `_teachersubjects`;

-- CreateTable
CREATE TABLE `TeacherSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `classId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LessonExams` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LessonExams_AB_unique`(`A`, `B`),
    INDEX `_LessonExams_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LessonAssignments` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LessonAssignments_AB_unique`(`A`, `B`),
    INDEX `_LessonAssignments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LessonAttendances` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LessonAttendances_AB_unique`(`A`, `B`),
    INDEX `_LessonAttendances_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeacherSubject` ADD CONSTRAINT `TeacherSubject_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherSubject` ADD CONSTRAINT `TeacherSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonExams` ADD CONSTRAINT `_LessonExams_A_fkey` FOREIGN KEY (`A`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonExams` ADD CONSTRAINT `_LessonExams_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonAssignments` ADD CONSTRAINT `_LessonAssignments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonAssignments` ADD CONSTRAINT `_LessonAssignments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonAttendances` ADD CONSTRAINT `_LessonAttendances_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonAttendances` ADD CONSTRAINT `_LessonAttendances_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
