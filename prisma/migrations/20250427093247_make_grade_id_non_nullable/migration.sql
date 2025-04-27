/*
  Warnings:

  - You are about to drop the `ClassSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_subjectId_fkey";

-- DropTable
DROP TABLE "ClassSubject";
