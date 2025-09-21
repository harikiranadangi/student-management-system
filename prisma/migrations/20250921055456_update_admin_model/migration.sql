/*
  Warnings:

  - The `gender` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bloodType` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Made the column `parentName` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."BloodType" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- DropIndex
DROP INDEX "public"."Admin_clerk_id_idx";

-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "parentName" SET NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "public"."Gender" NOT NULL DEFAULT 'Male',
DROP COLUMN "bloodType",
ADD COLUMN     "bloodType" "public"."BloodType";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "public"."Admin"("phone");

-- CreateIndex
CREATE INDEX "Admin_username_email_phone_idx" ON "public"."Admin"("username", "email", "phone");
