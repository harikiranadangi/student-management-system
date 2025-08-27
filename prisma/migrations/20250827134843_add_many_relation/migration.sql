/*
  Warnings:

  - Made the column `profileId` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Teacher" DROP CONSTRAINT "Teacher_profileId_fkey";

-- DropIndex
DROP INDEX "public"."Admin_profileId_key";

-- DropIndex
DROP INDEX "public"."Student_profileId_key";

-- DropIndex
DROP INDEX "public"."Teacher_profileId_key";

-- AlterTable
ALTER TABLE "public"."Teacher" ALTER COLUMN "profileId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
