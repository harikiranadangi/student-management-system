/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `result` table. All the data in the column will be lost.
  - You are about to drop the `assignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subjectId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Made the column `examId` on table `result` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `Result_assignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `Result_examId_fkey`;

-- DropIndex
DROP INDEX `Result_assignmentId_idx` ON `result`;

-- AlterTable
ALTER TABLE `result` DROP COLUMN `assignmentId`,
    ADD COLUMN `subjectId` INTEGER NOT NULL,
    MODIFY `examId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `assignment`;

-- CreateTable
CREATE TABLE `ExamSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `maxMarks` INTEGER NOT NULL,

    UNIQUE INDEX `ExamSubject_examId_subjectId_key`(`examId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Result_subjectId_idx` ON `Result`(`subjectId`);

-- AddForeignKey
ALTER TABLE `ExamSubject` ADD CONSTRAINT `ExamSubject_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamSubject` ADD CONSTRAINT `ExamSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
