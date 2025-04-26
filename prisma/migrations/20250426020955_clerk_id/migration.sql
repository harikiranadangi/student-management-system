/*
  Warnings:

  - A unique constraint covering the columns `[clerk_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_clerk_id_key" ON "Student"("clerk_id");
