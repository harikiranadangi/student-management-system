/*
  Warnings:

  - The values [FIRST,SECOND,THIRD,FOURTH,FIFTH,SIXTH,SEVENTH,EIGHTH,NINTH,TENTH,ELEVENTH,TWELFTH] on the enum `Students_grade` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `students` MODIFY `grade` ENUM('PRE_KG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X') NOT NULL;
