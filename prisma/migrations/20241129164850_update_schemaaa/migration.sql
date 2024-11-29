/*
  Warnings:

  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `Result_studentId_fkey`;

-- AlterTable
ALTER TABLE `attendance` MODIFY `studentId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `result` MODIFY `studentId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
