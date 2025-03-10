/*
  Warnings:

  - You are about to drop the `clerk_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "clerk_users";

-- CreateTable
CREATE TABLE "ClerkUser" (
    "clerk_id" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'student',
    "studentId" VARCHAR,

    CONSTRAINT "ClerkUser_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClerkUser_username_key" ON "ClerkUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkUser_studentId_key" ON "ClerkUser"("studentId");

-- AddForeignKey
ALTER TABLE "ClerkUser" ADD CONSTRAINT "ClerkUser_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
