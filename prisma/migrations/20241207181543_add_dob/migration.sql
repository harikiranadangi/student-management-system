/*
  Warnings:

  - Added the required column `dob` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `class` MODIFY `supervisorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `dob` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
