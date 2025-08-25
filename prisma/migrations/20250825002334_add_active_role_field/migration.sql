-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "activeRoleId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_activeRoleId_fkey" FOREIGN KEY ("activeRoleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
