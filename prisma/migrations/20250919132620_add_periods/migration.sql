-- CreateEnum
CREATE TYPE "public"."Period" AS ENUM ('PERIOD1', 'PERIOD2', 'PERIOD3', 'PERIOD4', 'PERIOD5', 'PERIOD6', 'PERIOD7', 'PERIOD8');

-- AlterTable
ALTER TABLE "public"."Lesson" ADD COLUMN     "period" "public"."Period";
