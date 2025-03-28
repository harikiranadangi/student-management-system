-- DropForeignKey
ALTER TABLE "FeeStructure" DROP CONSTRAINT "FeeStructure_gradeId_fkey";

-- AddForeignKey
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_id_fkey" FOREIGN KEY ("id") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
