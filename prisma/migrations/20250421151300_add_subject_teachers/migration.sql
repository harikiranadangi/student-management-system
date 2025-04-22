/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "teacherId";

-- CreateTable
CREATE TABLE "SubjectTeacher" (
    "subjectId" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("subjectId","teacherId")
);

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
