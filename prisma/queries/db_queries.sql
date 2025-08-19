-- 1. Retrieve table and column info

-- List all tables in public schema
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- List all columns and their data types for a table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Student';

-- 3. 1. Generate reset statements for all sequences

-- This generates ALTER SEQUENCE statements for all serial/bigserial columns
SELECT 
  'ALTER SEQUENCE "' || sequence_name || '" RESTART WITH ' || 
  COALESCE(
    '(SELECT COALESCE(MAX(' || column_name || '),0) + 1 FROM "' || table_name || '")', 
    1
  ) || ';' AS reset_command
FROM information_schema.sequences s
JOIN information_schema.columns c 
  ON s.sequence_name = c.column_default::text LIKE '%' || s.sequence_name || '%';


-- 2. Basic SELECT queries

-- Retrieve all records
SELECT * FROM "Student";
SELECT * FROM "Teacher";
SELECT * FROM "Class";
SELECT * FROM "Grade";
SELECT * FROM "FeeStructure";
SELECT * FROM "FeesCollection";
SELECT * FROM "StudentFees";
SELECT * FROM "FeeTransaction";
SELECT * FROM "Exam";
SELECT * FROM "ExamSubject";
SELECT * FROM "Subject";
SELECT * FROM "Homework";
SELECT * FROM "Lesson";
SELECT * FROM "Result";
SELECT * FROM "Attendance";
SELECT * FROM "Messages";

-- 3. Filtered SELECTs / joins
-- Students in a specific class
SELECT s.*
FROM "Student" s
JOIN "Class" c ON s."classId" = c.id
WHERE c.grade_id = 2;

-- Teachers supervising a class
SELECT t."name", c."name"
FROM "Teacher" t
LEFT JOIN "Class" c ON t.id = c."supervisorId";

-- Student fees details
SELECT sf.*
FROM "StudentFees" sf
JOIN "Student" s ON sf."studentId" = s.id
WHERE s.id = '17159';

-- Attendance of a specific student
SELECT * 
FROM "Attendance"
WHERE "studentId" = '13738';

-- Homework in a date range
SELECT id, date 
FROM "Homework"
WHERE date BETWEEN '2025-03-18' AND '2025-03-20';

-- Truncate all tables & restart IDs
DO
$$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE;';
    END LOOP;
END
$$;

TRUNCATE TABLE
  "Admin",
  "Grade",
  "class",
  "Teacher",
  "Lesson",
  "Subject",
  "Announcement",
  "Messages",
  "Student",
  "Event",
  "Exam",
  "ExamGradeSubject",
  "Homework",
  "Result",
  "ClerkStudents",
  "ClerkTeachers",
  "SubjectTeacher",
  "FeeStructure",
  "StudentFees",
  "FeeTransaction",
  "StudentTotalFees",
  "Attendance",
  "CancelledReceipt",
  "PermissionSlip",
  "_SubjectGrades"
RESTART IDENTITY CASCADE;




