/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `ClerkUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ClerkUser_clerk_id_key";

-- AlterTable
ALTER TABLE "ClerkUser" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "username" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ClerkUser_user_id_key" ON "ClerkUser"("user_id");
