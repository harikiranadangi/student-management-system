/*
  Warnings:

  - Added the required column `dueAmount` to the `Fee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFee` to the `Fee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fee` ADD COLUMN `dueAmount` INTEGER NOT NULL,
    ADD COLUMN `extraFee` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `paidAmount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalFee` INTEGER NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Not Paid';
