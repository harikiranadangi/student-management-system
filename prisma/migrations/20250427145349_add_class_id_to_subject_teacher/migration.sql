/*
  Warnings:

  - The primary key for the `SubjectTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `classId` to the `SubjectTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_pkey",
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("subjectId", "teacherId", "classId");

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
