/*
  Warnings:

  - The primary key for the `FeesStructure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FeesStructure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeesStructure" DROP CONSTRAINT "FeesStructure_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FeesStructure_pkey" PRIMARY KEY ("gradeId");
