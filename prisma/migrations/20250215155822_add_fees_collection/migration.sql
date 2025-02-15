/*
  Warnings:

  - You are about to alter the column `term` on the `fee` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `fee` MODIFY `term` ENUM('TERM1', 'TERM2', 'TERM3', 'TERM4') NOT NULL;
