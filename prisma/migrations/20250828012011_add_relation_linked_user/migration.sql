/*
  Warnings:

  - A unique constraint covering the columns `[linkedUserId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedUserId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."LinkedUser" ADD COLUMN     "adminId" TEXT;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "linkedUserId" TEXT;

-- AlterTable
ALTER TABLE "public"."Teacher" ADD COLUMN     "linkedUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_linkedUserId_key" ON "public"."Student"("linkedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_linkedUserId_key" ON "public"."Teacher"("linkedUserId");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LinkedUser" ADD CONSTRAINT "LinkedUser_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
