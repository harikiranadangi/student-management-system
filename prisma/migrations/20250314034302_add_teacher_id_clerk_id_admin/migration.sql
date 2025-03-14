/*
  Warnings:

  - A unique constraint covering the columns `[teacherId]` on the table `ClerkUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerk_id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `full_name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "ClerkUser" ADD COLUMN     "teacherId" VARCHAR;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "clerk_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ClerkUser_teacherId_key" ON "ClerkUser"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_clerk_id_key" ON "Teacher"("clerk_id");

-- AddForeignKey
ALTER TABLE "ClerkUser" ADD CONSTRAINT "ClerkUser_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
