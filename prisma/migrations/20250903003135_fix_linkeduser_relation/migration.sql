/*
  Warnings:

  - You are about to drop the column `adminId` on the `LinkedUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[linkedUserId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."LinkedUser" DROP CONSTRAINT "LinkedUser_adminId_fkey";

-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "linkedUserId" TEXT;

-- AlterTable
ALTER TABLE "public"."LinkedUser" DROP COLUMN "adminId";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_linkedUserId_key" ON "public"."Admin"("linkedUserId");

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
