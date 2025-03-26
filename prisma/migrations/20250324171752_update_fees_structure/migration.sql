-- DropForeignKey
ALTER TABLE "FeesStructure" DROP CONSTRAINT "FeesStructure_classId_fkey";

-- AddForeignKey
ALTER TABLE "FeesStructure" ADD CONSTRAINT "FeesStructure_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
