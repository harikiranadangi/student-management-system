-- DropForeignKey
ALTER TABLE "FeeStructure" DROP CONSTRAINT "FeeStructure_id_fkey";

-- AddForeignKey
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
