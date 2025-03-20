/*
  Warnings:

  - You are about to drop the column `user_id` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT;
