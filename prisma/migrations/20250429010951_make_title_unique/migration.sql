/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exam_title_key" ON "Exam"("title");
