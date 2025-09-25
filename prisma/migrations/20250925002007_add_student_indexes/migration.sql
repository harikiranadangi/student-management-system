-- CreateIndex
CREATE INDEX "Student_status_idx" ON "public"."Student"("status");

-- CreateIndex
CREATE INDEX "Student_gender_idx" ON "public"."Student"("gender");

-- CreateIndex
CREATE INDEX "Student_academicYear_idx" ON "public"."Student"("academicYear");

-- CreateIndex
CREATE INDEX "Student_name_idx" ON "public"."Student"("name");

-- CreateIndex
CREATE INDEX "Student_phone_idx" ON "public"."Student"("phone");

-- CreateIndex
CREATE INDEX "Student_status_classId_idx" ON "public"."Student"("status", "classId");

-- CreateIndex
CREATE INDEX "Student_status_gender_idx" ON "public"."Student"("status", "gender");
