-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "gradeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
