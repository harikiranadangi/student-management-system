/*
  Warnings:

  - A unique constraint covering the columns `[clerk_id]` on the table `ClerkUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClerkUser_clerk_id_key" ON "ClerkUser"("clerk_id");
