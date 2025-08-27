-- DropForeignKey
ALTER TABLE "public"."Teacher" DROP CONSTRAINT "Teacher_profileId_fkey";

-- AlterTable
ALTER TABLE "public"."Teacher" ALTER COLUMN "profileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
