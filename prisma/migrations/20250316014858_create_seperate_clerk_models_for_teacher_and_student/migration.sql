/*
  Warnings:

  - You are about to drop the `ClerkUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClerkUser" DROP CONSTRAINT "ClerkUser_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ClerkUser" DROP CONSTRAINT "ClerkUser_teacherId_fkey";

-- DropTable
DROP TABLE "ClerkUser";

-- CreateTable
CREATE TABLE "ClerkStudents" (
    "clerk_id" VARCHAR NOT NULL,
    "user_id" TEXT,
    "username" TEXT NOT NULL,
    "password" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'student',
    "studentId" VARCHAR,

    CONSTRAINT "ClerkStudents_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateTable
CREATE TABLE "ClerkTeachers" (
    "clerk_id" VARCHAR NOT NULL,
    "user_id" TEXT,
    "username" TEXT NOT NULL,
    "password" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'teacher',
    "teacherId" VARCHAR,

    CONSTRAINT "ClerkTeachers_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClerkStudents_user_id_key" ON "ClerkStudents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkStudents_username_key" ON "ClerkStudents"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkStudents_studentId_key" ON "ClerkStudents"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_user_id_key" ON "ClerkTeachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_username_key" ON "ClerkTeachers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_teacherId_key" ON "ClerkTeachers"("teacherId");

-- AddForeignKey
ALTER TABLE "ClerkStudents" ADD CONSTRAINT "ClerkStudents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClerkTeachers" ADD CONSTRAINT "ClerkTeachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
