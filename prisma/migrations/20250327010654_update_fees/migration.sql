/*
  Warnings:

  - You are about to drop the `FeesStructure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeesCollection" DROP CONSTRAINT "FeesCollection_feesStructureId_fkey";

-- DropForeignKey
ALTER TABLE "FeesStructure" DROP CONSTRAINT "FeesStructure_gradeId_fkey";

-- DropTable
DROP TABLE "FeesStructure";

-- CreateTable
CREATE TABLE "FeeStructure" (
    "id" SERIAL NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "termFees" INTEGER NOT NULL,
    "abacusFees" INTEGER,

    CONSTRAINT "FeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_gradeId_term_key" ON "FeeStructure"("gradeId", "term");

-- AddForeignKey
ALTER TABLE "FeesCollection" ADD CONSTRAINT "FeesCollection_feesStructureId_fkey" FOREIGN KEY ("feesStructureId") REFERENCES "FeeStructure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
