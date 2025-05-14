-- DropIndex
DROP INDEX "Teacher_email_key";

-- AlterTable
ALTER TABLE "ClerkTeachers" ADD COLUMN     "publicMetadata" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "parentName" TEXT;
