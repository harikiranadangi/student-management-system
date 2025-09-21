/*
  Warnings:

  - Made the column `phone` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "dob" SET NOT NULL;
