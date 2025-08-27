/*
  Warnings:

  - You are about to drop the column `activeRoleId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[activeUserId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_activeRoleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Role" DROP CONSTRAINT "Role_profileId_fkey";

-- DropIndex
DROP INDEX "public"."Profile_phone_key";

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "activeRoleId",
ADD COLUMN     "activeUserId" TEXT;

-- DropTable
DROP TABLE "public"."Role";

-- CreateTable
CREATE TABLE "public"."LinkedUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "LinkedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_activeUserId_key" ON "public"."Profile"("activeUserId");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_activeUserId_fkey" FOREIGN KEY ("activeUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LinkedUser" ADD CONSTRAINT "LinkedUser_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
