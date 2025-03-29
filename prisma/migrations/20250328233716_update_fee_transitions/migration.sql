/*
  Warnings:

  - A unique constraint covering the columns `[fbNumber]` on the table `StudentFees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fbNumber` to the `StudentFees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentFees" ADD COLUMN     "fbNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_fbNumber_key" ON "StudentFees"("fbNumber");
