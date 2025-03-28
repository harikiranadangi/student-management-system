/*
  Warnings:

  - The `feesStructureId` column on the `FeesCollection` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FeesStructure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `FeesStructure` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "FeesCollection" DROP CONSTRAINT "FeesCollection_feesStructureId_fkey";

-- AlterTable
ALTER TABLE "FeesCollection" DROP COLUMN "feesStructureId",
ADD COLUMN     "feesStructureId" INTEGER;

-- AlterTable
ALTER TABLE "FeesStructure" DROP CONSTRAINT "FeesStructure_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "FeesStructure_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "FeesCollection" ADD CONSTRAINT "FeesCollection_feesStructureId_fkey" FOREIGN KEY ("feesStructureId") REFERENCES "FeesStructure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
