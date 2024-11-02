/*
  Warnings:

  - You are about to alter the column `studentId` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `studentId` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `students` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `Payments_studentId_fkey`;

-- AlterTable
ALTER TABLE `attendance` MODIFY `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payments` MODIFY `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `students` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
