/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Admin_clerkId_key";

-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "clerkId",
ADD COLUMN     "clerk_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerk_id_key" ON "public"."Admin"("clerk_id");
