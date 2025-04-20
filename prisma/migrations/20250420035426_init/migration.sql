-- CreateEnum
CREATE TYPE "LessonDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Term" AS ENUM ('TERM_1', 'TERM_2', 'TERM_3', 'TERM_4');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'ONLINE', 'UPI', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "AcademicYear" AS ENUM ('Y2024_2025', 'Y2025_2026');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('ABSENT', 'FEE_RELATED', 'ANNOUNCEMENT', 'GENERAL');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "parentName" TEXT,
    "gender" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "img" TEXT,
    "bloodType" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clerkId" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "supervisorId" TEXT,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "day" "LessonDay" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "studentId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSubject" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "maxMarks" INTEGER NOT NULL,

    CONSTRAINT "ExamSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "studentId" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "parentName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "clerk_id" TEXT,
    "academicYear" "AcademicYear" NOT NULL DEFAULT 'Y2024_2025',
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "supervisor" BOOLEAN NOT NULL DEFAULT false,
    "dob" TIMESTAMP(3),
    "classId" TEXT,
    "clerk_id" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "teacherId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("teacherId","subjectId")
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

-- CreateTable
CREATE TABLE "FeeStructure" (
    "id" SERIAL NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "termFees" INTEGER NOT NULL,
    "abacusFees" INTEGER,
    "term" "Term" NOT NULL,
    "academicYear" "AcademicYear" NOT NULL DEFAULT 'Y2024_2025',

    CONSTRAINT "FeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeTransaction" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "studentFeesId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "receivedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "receiptNo" TEXT NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "FeeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFees" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "abacusPaidAmount" INTEGER,
    "feeStructureId" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "fineAmount" INTEGER NOT NULL DEFAULT 0,
    "receiptDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
    "academicYear" "AcademicYear" NOT NULL DEFAULT 'Y2024_2025',
    "receiptNo" TEXT,
    "term" TEXT NOT NULL,
    "remarks" TEXT DEFAULT '',

    CONSTRAINT "StudentFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTotalFees" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalPaidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDiscountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAbacusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFeeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Not Paid',

    CONSTRAINT "StudentTotalFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "studentId" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkId_key" ON "Admin"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_level_key" ON "Grade"("level");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "class"("name");

-- CreateIndex
CREATE UNIQUE INDEX "class_supervisorId_key" ON "class"("supervisorId");

-- CreateIndex
CREATE INDEX "Class_gradeId_idx" ON "class"("gradeId");

-- CreateIndex
CREATE INDEX "Class_supervisorId_idx" ON "class"("supervisorId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_name_key" ON "Lesson"("name");

-- CreateIndex
CREATE INDEX "Lesson_classId_idx" ON "Lesson"("classId");

-- CreateIndex
CREATE INDEX "Lesson_subjectId_idx" ON "Lesson"("subjectId");

-- CreateIndex
CREATE INDEX "Lesson_teacherId_idx" ON "Lesson"("teacherId");

-- CreateIndex
CREATE INDEX "Announcement_classId_idx" ON "Announcement"("classId");

-- CreateIndex
CREATE INDEX "Event_classId_idx" ON "Event"("classId");

-- CreateIndex
CREATE INDEX "Exam_classId_idx" ON "Exam"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSubject_examId_subjectId_key" ON "ExamSubject"("examId", "subjectId");

-- CreateIndex
CREATE INDEX "Homework_classId_idx" ON "Homework"("classId");

-- CreateIndex
CREATE INDEX "Result_examId_idx" ON "Result"("examId");

-- CreateIndex
CREATE INDEX "Result_studentId_idx" ON "Result"("studentId");

-- CreateIndex
CREATE INDEX "Result_subjectId_idx" ON "Result"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_clerk_id_key" ON "Student"("clerk_id");

-- CreateIndex
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkStudents_user_id_key" ON "ClerkStudents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkStudents_username_key" ON "ClerkStudents"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkStudents_studentId_key" ON "ClerkStudents"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_username_key" ON "Teacher"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_classId_key" ON "Teacher"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_clerk_id_key" ON "Teacher"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_user_id_key" ON "ClerkTeachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_username_key" ON "ClerkTeachers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_teacherId_key" ON "ClerkTeachers"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_gradeId_term_academicYear_key" ON "FeeStructure"("gradeId", "term", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_academicYear_term_key" ON "StudentFees"("studentId", "academicYear", "term");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTotalFees_studentId_key" ON "StudentTotalFees"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "Attendance"("studentId", "date");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClerkStudents" ADD CONSTRAINT "ClerkStudents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClerkTeachers" ADD CONSTRAINT "ClerkTeachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentFeesId_fkey" FOREIGN KEY ("studentFeesId") REFERENCES "StudentFees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFees" ADD CONSTRAINT "StudentFees_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "FeeStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFees" ADD CONSTRAINT "StudentFees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTotalFees" ADD CONSTRAINT "StudentTotalFees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
