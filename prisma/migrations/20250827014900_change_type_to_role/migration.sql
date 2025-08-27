/*
  Warnings:

  - You are about to drop the column `type` on the `LinkedUser` table. All the data in the column will be lost.
  - Added the required column `role` to the `LinkedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LinkedUser" DROP COLUMN "type",
ADD COLUMN     "role" TEXT NOT NULL;
