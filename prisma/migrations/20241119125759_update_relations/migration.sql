/*
  Warnings:

  - You are about to drop the `_classteachers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teacherId,subjectId]` on the table `TeacherSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_classteachers` DROP FOREIGN KEY `_ClassTeachers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_classteachers` DROP FOREIGN KEY `_ClassTeachers_B_fkey`;

-- DropTable
DROP TABLE `_classteachers`;

-- CreateIndex
CREATE UNIQUE INDEX `TeacherSubject_teacherId_subjectId_key` ON `TeacherSubject`(`teacherId`, `subjectId`);
