/*
  Warnings:

  - You are about to drop the column `gradeId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_gradeId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "gradeId";

-- CreateTable
CREATE TABLE "_SubjectGrades" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubjectGrades_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectGrades_B_index" ON "_SubjectGrades"("B");

-- AddForeignKey
ALTER TABLE "_SubjectGrades" ADD CONSTRAINT "_SubjectGrades_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectGrades" ADD CONSTRAINT "_SubjectGrades_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
