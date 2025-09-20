/*
  Warnings:

  - Made the column `period` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Lesson" ALTER COLUMN "period" SET NOT NULL;
