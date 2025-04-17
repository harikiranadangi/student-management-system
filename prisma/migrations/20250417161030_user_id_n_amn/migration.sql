/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkId_key" ON "Admin"("clerkId");
