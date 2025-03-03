/*
  Warnings:

  - Added the required column `classId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "classId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FeesStructure" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "totalFees" INTEGER NOT NULL,
    "abacusFees" INTEGER NOT NULL,
    "termFees" INTEGER NOT NULL,

    CONSTRAINT "FeesStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFees" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "termNumber" INTEGER NOT NULL,
    "paidAmount" INTEGER NOT NULL,
    "abacusPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentFees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeesStructure_classId_key" ON "FeesStructure"("classId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeesStructure" ADD CONSTRAINT "FeesStructure_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFees" ADD CONSTRAINT "StudentFees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
