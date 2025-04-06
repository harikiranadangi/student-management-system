/*
  Warnings:

  - A unique constraint covering the columns `[studentId,academicYear,term]` on the table `StudentFees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYear` to the `StudentFees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AcademicYear" AS ENUM ('Y2024_2025', 'Y2025_2026');

-- DropIndex
DROP INDEX "StudentFees_studentId_term_key";

-- AlterTable
ALTER TABLE "StudentFees" ADD COLUMN     "academicYear" "AcademicYear" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_academicYear_term_key" ON "StudentFees"("studentId", "academicYear", "term");
