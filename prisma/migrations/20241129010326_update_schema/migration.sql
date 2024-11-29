/*
  Warnings:

  - You are about to drop the column `homeworkId` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `homeworkId` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the `homework` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_homeworkId_fkey`;

-- DropForeignKey
ALTER TABLE `subject` DROP FOREIGN KEY `Subject_homeworkId_fkey`;

-- AlterTable
ALTER TABLE `admin` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `class` DROP COLUMN `homeworkId`;

-- AlterTable
ALTER TABLE `subject` DROP COLUMN `homeworkId`;

-- DropTable
DROP TABLE `homework`;

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_email_key` ON `Teacher`(`email`);
