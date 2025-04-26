/*
  Warnings:

  - You are about to drop the column `publicMetadata` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClerkStudents" ADD COLUMN     "publicMetadata" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "publicMetadata";
