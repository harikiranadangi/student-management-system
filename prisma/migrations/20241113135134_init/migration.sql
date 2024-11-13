/*
  Warnings:

  - You are about to alter the column `status` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Teachers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `status` ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL;

-- AlterTable
ALTER TABLE `payments` MODIFY `status` ENUM('PAID', 'PENDING', 'OVERDUE') NOT NULL;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `img` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Teachers_mobileNumber_key` ON `Teachers`(`mobileNumber`);
