-- CreateEnum
CREATE TYPE "public"."LessonDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."Term" AS ENUM ('TERM_1', 'TERM_2', 'TERM_3', 'TERM_4');

-- CreateEnum
CREATE TYPE "public"."PaymentMode" AS ENUM ('CASH', 'ONLINE', 'UPI', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "public"."AcademicYear" AS ENUM ('Y2024_2025', 'Y2025_2026');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('ABSENT', 'FEE_RELATED', 'ANNOUNCEMENT', 'GENERAL', 'FEE_COLLECTION');

-- CreateEnum
CREATE TYPE "public"."LeaveType" AS ENUM ('SICK', 'PERSONAL', 'HALFDAY', 'DAILY_PERMISSION');

-- CreateEnum
CREATE TYPE "public"."StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
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
    "clerk_id" TEXT,
    "profileId" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Grade" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT,
    "supervisorId" TEXT,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "day" "public"."LessonDay" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."MessageType" NOT NULL,
    "studentId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Exam" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExamGradeSubject" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "maxMarks" INTEGER NOT NULL,

    CONSTRAINT "ExamGradeSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Homework" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT,
    "description" TEXT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Result" (
    "id" SERIAL NOT NULL,
    "marks" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentName" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT,
    "gender" "public"."Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "clerk_id" TEXT,
    "academicYear" "public"."AcademicYear" NOT NULL DEFAULT 'Y2024_2025',
    "classId" INTEGER NOT NULL,
    "profileId" TEXT,
    "linkedUserId" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Teacher" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentName" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT,
    "gender" "public"."Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "supervisor" BOOLEAN NOT NULL DEFAULT false,
    "dob" TIMESTAMP(3),
    "profileId" TEXT,
    "classId" INTEGER,
    "clerk_id" TEXT,
    "linkedUserId" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClerkTeachers" (
    "clerk_id" VARCHAR NOT NULL,
    "user_id" TEXT,
    "username" TEXT NOT NULL,
    "password" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'teacher',
    "teacherId" VARCHAR,
    "publicMetadata" JSONB DEFAULT '{}',

    CONSTRAINT "ClerkTeachers_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateTable
CREATE TABLE "public"."SubjectTeacher" (
    "subjectId" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("subjectId","teacherId","classId")
);

-- CreateTable
CREATE TABLE "public"."FeeStructure" (
    "id" SERIAL NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "termFees" INTEGER NOT NULL,
    "abacusFees" INTEGER,
    "term" "public"."Term" NOT NULL,
    "academicYear" "public"."AcademicYear" NOT NULL DEFAULT 'Y2024_2025',

    CONSTRAINT "FeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FeeTransaction" (
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
    "paymentMode" "public"."PaymentMode" NOT NULL DEFAULT 'CASH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "deletedAt" TIMESTAMP(3),
    "transactionType" TEXT NOT NULL DEFAULT 'PAYMENT',
    "updatedByName" TEXT,

    CONSTRAINT "FeeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentFees" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "abacusPaidAmount" INTEGER,
    "feeStructureId" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "fineAmount" INTEGER NOT NULL DEFAULT 0,
    "receiptDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "paymentMode" "public"."PaymentMode" NOT NULL DEFAULT 'CASH',
    "academicYear" "public"."AcademicYear" NOT NULL DEFAULT 'Y2024_2025',
    "receiptNo" TEXT,
    "term" TEXT NOT NULL,
    "remarks" TEXT DEFAULT '',
    "updatedByName" TEXT,

    CONSTRAINT "StudentFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentTotalFees" (
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
CREATE TABLE "public"."Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "studentId" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CancelledReceipt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "originalReceiptNo" TEXT NOT NULL,
    "cancelledDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledBy" TEXT,
    "reason" TEXT,
    "cancelledAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cancelledDiscount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cancelledFine" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cancelledTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "CancelledReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PermissionSlip" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "leaveType" "public"."LeaveType" NOT NULL,
    "subReason" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeIssued" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withWhom" TEXT,
    "relation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionSlip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "phone" TEXT,
    "activeUserId" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LinkedUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "LinkedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SubjectGrades" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubjectGrades_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerk_id_key" ON "public"."Admin"("clerk_id");

-- CreateIndex
CREATE INDEX "Admin_clerk_id_idx" ON "public"."Admin"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_level_key" ON "public"."Grade"("level");

-- CreateIndex
CREATE UNIQUE INDEX "class_supervisorId_key" ON "public"."class"("supervisorId");

-- CreateIndex
CREATE INDEX "Class_gradeId_idx" ON "public"."class"("gradeId");

-- CreateIndex
CREATE INDEX "Class_supervisorId_idx" ON "public"."class"("supervisorId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_gradeId_section_key" ON "public"."class"("gradeId", "section");

-- CreateIndex
CREATE INDEX "Lesson_classId_idx" ON "public"."Lesson"("classId");

-- CreateIndex
CREATE INDEX "Lesson_subjectId_idx" ON "public"."Lesson"("subjectId");

-- CreateIndex
CREATE INDEX "Lesson_teacherId_idx" ON "public"."Lesson"("teacherId");

-- CreateIndex
CREATE INDEX "Announcement_classId_idx" ON "public"."Announcement"("classId");

-- CreateIndex
CREATE INDEX "Event_classId_idx" ON "public"."Event"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_title_key" ON "public"."Exam"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ExamGradeSubject_examId_gradeId_subjectId_key" ON "public"."ExamGradeSubject"("examId", "gradeId", "subjectId");

-- CreateIndex
CREATE INDEX "Homework_classId_idx" ON "public"."Homework"("classId");

-- CreateIndex
CREATE INDEX "Homework_gradeId_idx" ON "public"."Homework"("gradeId");

-- CreateIndex
CREATE INDEX "Homework_groupId_idx" ON "public"."Homework"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_studentId_examId_subjectId_key" ON "public"."Result"("studentId", "examId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "public"."Student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_linkedUserId_key" ON "public"."Student"("linkedUserId");

-- CreateIndex
CREATE INDEX "Student_classId_idx" ON "public"."Student"("classId");

-- CreateIndex
CREATE INDEX "Student_clerk_id_idx" ON "public"."Student"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "public"."Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_username_key" ON "public"."Teacher"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_classId_key" ON "public"."Teacher"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_clerk_id_key" ON "public"."Teacher"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_linkedUserId_key" ON "public"."Teacher"("linkedUserId");

-- CreateIndex
CREATE INDEX "Teacher_clerk_id_idx" ON "public"."Teacher"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_user_id_key" ON "public"."ClerkTeachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_username_key" ON "public"."ClerkTeachers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkTeachers_teacherId_key" ON "public"."ClerkTeachers"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_gradeId_term_academicYear_key" ON "public"."FeeStructure"("gradeId", "term", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFees_studentId_academicYear_term_key" ON "public"."StudentFees"("studentId", "academicYear", "term");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTotalFees_studentId_key" ON "public"."StudentTotalFees"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "public"."Attendance"("studentId", "date");

-- CreateIndex
CREATE INDEX "CancelledReceipt_studentId_idx" ON "public"."CancelledReceipt"("studentId");

-- CreateIndex
CREATE INDEX "CancelledReceipt_term_idx" ON "public"."CancelledReceipt"("term");

-- CreateIndex
CREATE INDEX "CancelledReceipt_originalReceiptNo_idx" ON "public"."CancelledReceipt"("originalReceiptNo");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_clerk_id_key" ON "public"."Profile"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_activeUserId_key" ON "public"."Profile"("activeUserId");

-- CreateIndex
CREATE INDEX "_SubjectGrades_B_index" ON "public"."_SubjectGrades"("B");

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "class_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamGradeSubject" ADD CONSTRAINT "ExamGradeSubject_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamGradeSubject" ADD CONSTRAINT "ExamGradeSubject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamGradeSubject" ADD CONSTRAINT "ExamGradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Homework" ADD CONSTRAINT "Homework_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Homework" ADD CONSTRAINT "Homework_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClerkTeachers" ADD CONSTRAINT "ClerkTeachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeeStructure" ADD CONSTRAINT "FeeStructure_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentFeesId_fkey" FOREIGN KEY ("studentFeesId") REFERENCES "public"."StudentFees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentFees" ADD CONSTRAINT "StudentFees_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "public"."FeeStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentFees" ADD CONSTRAINT "StudentFees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTotalFees" ADD CONSTRAINT "StudentTotalFees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CancelledReceipt" ADD CONSTRAINT "CancelledReceipt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionSlip" ADD CONSTRAINT "PermissionSlip_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_activeUserId_fkey" FOREIGN KEY ("activeUserId") REFERENCES "public"."LinkedUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LinkedUser" ADD CONSTRAINT "LinkedUser_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LinkedUser" ADD CONSTRAINT "LinkedUser_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SubjectGrades" ADD CONSTRAINT "_SubjectGrades_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SubjectGrades" ADD CONSTRAINT "_SubjectGrades_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
