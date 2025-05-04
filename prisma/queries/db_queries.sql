-- Retrieve all table names from the public schema
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Generate SELECT queries for all tables in the public schema
SELECT 'SELECT * FROM ' || tablename || ';'  
FROM pg_tables  
WHERE schemaname = 'public';

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

COPY "Teacher" (id, username, name, surname, email, phone, address, img, "bloodType", gender, dob, "classId", clerk_id)
FROM 'H:/student-management-system/data/teachers_data.csv'
WITH (FORMAT CSV, HEADER, DELIMITER ',', QUOTE '"');

COPY "Student" ( id,username,name,surname,"parentName",email,phone,address,img,"bloodType",gender,dob,"createdAt","deletedAt","classId",clerk_id,"academicYear"
)
FROM 'H:/student-management-system/data/student_data.csv'
WITH (
  FORMAT CSV,
  HEADER,
  DELIMITER ',',
  QUOTE '"'
);


-- Clerk Teachers
COPY "ClerkTeachers"(clerk_id, username, password, full_name, role, "teacherId")
FROM 'H:/student-management-system/data/clerk_teacher_data.csv'
WITH CSV HEADER DELIMITER ',';

-- Clerk Students
COPY "ClerkStudents"(clerk_id, username, password, full_name, role, "studentId")
FROM 'H:/student-management-system/data/clerk_student_data.csv'
WITH CSV HEADER DELIMITER ',';

-- FeeStructure
COPY "FeeStructure" ( "gradeId", "abacusFees", "termFees","term","startDate", "dueDate", "academicYear")
FROM 'H:/student-management-system/data/fees_structure.csv'
WITH CSV HEADER DELIMITER ',';

SELECT * FROM "ClerkStudents";
DROP TABLE IF EXISTS "ClerkStudents" CASCADE;


SELECT *
FROM "Student" s
JOIN "ClerkStudents" cu ON s.id = cu.clerk_id
WHERE cu.username = 'S14384A';

SELECT * FROM "ClerkStudents" WHERE username = 's14384A';

-- "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d kotakdatabase



SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ClerkUser';

SELECT id, username, clerk_id FROM "Student" WHERE clerk_id = 'user_2u7uazlBqLYKlsChmAcRyf32DkH';



SELECT * FROM "ClerkStudents";

DELETE FROM "ClerkStudents";



SELECT * FROM "ClerkTeachers";

DELETE FROM "ClerkTeachers";

SELECT * FROM "Teacher";

SELECT * FROM "Teacher" WHERE clerk_id IS NOT  NULL; 

SELECT * FROM "ClerkTeachers" WHERE user_id IS NOT NULL;

-- STUDENTS

SELECT * FROM "Student";

SELECT * FROM "Student" WHERE clerk_id IS NOT  NULL; 

SELECT * FROM "ClerkStudents" WHERE user_id IS NOT NULL;


SELECT tablename FROM pg_tables WHERE schemaname = 'public';

SELECT c.* 
FROM class c
JOIN "Student" s ON s.classId = c.id
WHERE s.id = 'user_2u6ahhxsTFkUDWxoRuIksBMU69v';

SELECT * FROM "Student" WHERE "id" = '17162';

UPDATE "Student"
SET "clerk_id" = 'user_2u7ubByZC3lSLGwSUvmNQJ83oFb'
WHERE "id" = '17152'; -- Replace with the actual student ID

UPDATE "Student" s
SET clerk_id = c.user_id
FROM "ClerkUser" c
WHERE s.id = c.clerk_id;



-- View all migration records from Prisma's migration table
SELECT * FROM _prisma_migrations;

-- Retrieve all records from the Admin table
SELECT * FROM "Admin";

-- Retrieve all records from the class table
SELECT * FROM class;

SELECT column_name FROM information_schema.columns WHERE table_name = 'class';


SELECT * FROM "Teacher" WHERE id = 'T1';

SELECT * FROM "Grade" WHERE id = 1;

SELECT * FROM "Student" WHERE "gradeId" = 2;

SELECT s.* 
FROM "Student" s
JOIN "Class" c ON s."classId" = c.id
WHERE c.grade_id = 2;

SELECT * FROM "class" WHERE "gradeId" = 2;

SELECT * FROM "Student" WHERE "classId" IN (SELECT id FROM "class" WHERE "gradeId" = 2);


SELECT * FROM "class" ;


SELECT "supervisorId" FROM "class" LIMIT 5;


SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'class' AND column_name = 'supervisorId';

SELECT id, clerk_id, classId FROM student WHERE clerk_id = '13553';



SELECT setval('"class_id_seq"', (SELECT MAX(id) FROM "class"));


SELECT * FROM "teacher" WHERE id = 'user_2u2pXhmNqzsHVzrbD2WbjYYfLsO';

-- Retrieve all records from the Announcement table (incorrect syntax - should use double quotes)
SELECT * FROM "Announcement";

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Announcement';



-- Retrieve all records from the Student table
SELECT * FROM "Student";

SELECT * FROM "Student" 
ORDER BY "classId" ASC, "gender" DESC, "name" ASC;

-- First check the ClerkUser table
SELECT * FROM ClerkUser WHERE id = '17159';

-- If not found, check the students table
SELECT * FROM "Student" WHERE id = '17159';


-- Retrieve all records from the Grade table
SELECT * FROM "Grade";

-- Retrieve all records from the Teacher table
SELECT * FROM "Teacher";

DELETE FROM "Teacher";



SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Teacher';

SELECT "Teacher"."name", "class"."name"
FROM "Teacher"
LEFT JOIN "class" ON "Teacher"."id" = "class"."supervisorId";

SELECT "Teacher"."name", "class"."name"
FROM "Teacher"
LEFT JOIN "class" ON "Teacher"."id" = "class"."supervisorId"::text; -- Ensure the data type matches

SELECT "Teacher"."name"
FROM "Teacher"
LEFT JOIN "class" ON "Teacher"."id" = "class"."supervisorId"::text
WHERE "class"."name" IS NULL;


SELECT column_name FROM information_schema.columns 
WHERE table_name = 'Teacher';



-- Retrieve all records from the Event table
SELECT * FROM "Event";

INSERT INTO schedule (classId, title, startTime, endTime)
VALUES 
(1, 'Math Class', '2025-03-11 09:00:00', '2025-03-11 10:00:00'),
(1, 'English Class', '2025-03-11 10:30:00', '2025-03-11 11:30:00');


-- Retrieve all records from the Exam table
SELECT * FROM "Exam";

-- Retrieve all records from the ExamSubject table
SELECT * FROM "ExamSubject";

-- Retrieve all records from the Subject table
SELECT * FROM "Subject";

DELETE FROM "Subject" WHERE "gradeId" IS NULL;

-- Retrieve all records from the Fee table
SELECT * FROM "Fee";

-- Retrieve all records from the Homework table
SELECT * FROM "Homework";

-- Retrieve all records from the Lesson table
SELECT * FROM "Lesson";

INSERT INTO lesson (name, day, classId, subject, startTime, endTime, teacherId)  
VALUES  
(1, 'Math', '2025-03-11 09:00:00', '2025-03-11 10:00:00', 5),  
(1, 'English', '2025-03-11 10:30:00', '2025-03-11 11:30:00', 6);


-- Retrieve all records from the Result table
SELECT * FROM "Result";

-- Retrieve all records from the Attendance table
SELECT * FROM "Attendance";

SELECT * 
FROM "Attendance" 
WHERE "studentId" = '13738';


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Attendance';

DELETE FROM "Attendance";

SELECT conname
FROM pg_constraint
WHERE conrelid = '"Attendance"'::regclass;

-- Retrieve all records from the FeeStructure table
SELECT * FROM "FeeStructure";

SELECT * FROM "FeeStructure"
WHERE "gradeId" NOT IN (SELECT id FROM "Grade");


SET datestyle = 'DMY';

SET datestyle = 'ISO, MDY';

UPDATE "FeeStructure"
SET "startDate" = "startDate"::DATE,
    "dueDate" = "dueDate"::DATE;




SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'FeesStructure';


DELETE FROM "FeeStructure";


-- Retrieve all records from the StudentFees table
SELECT * FROM "StudentFees";

-- Retrieve all records from the TeacherSubject table
SELECT * FROM "TeacherSubject";

SELECT * FROM "Homework";

SELECT id, date FROM "Homework" WHERE date BETWEEN '2025-03-18' AND '2025-03-20';

SHOW TIMEZONE;

SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'Homework' AND column_name = 'date';

await prisma.$queryRaw`
  SELECT * FROM "Homework"
  WHERE date::date = ${selectedDate};
`;

SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'Homework';


SELECT * FROM "Homework";

UPDATE "Homework" SET "gradeId" = 5 WHERE "classId" = 13;

SELECT * FROM "FeesCollection" LIMIT 10;

SELECT * FROM "FeesCollection" WHERE "studentId" = '17159';

SELECT * FROM "FeesCollection" WHERE "gradeId" = (SELECT "gradeId" FROM "Student" WHERE id = '17159');

SELECT * FROM "FeeStructure";

INSERT INTO "FeeStructure" ("gradeId", "academicYear", "startDate", "dueDate", "termFees", "abacusFees", "totalFees")
VALUES
(1, '2024-25', '2024-06-01', '2025-01-20', 5250, 0, 10500),
(2, '2024-25', '2024-06-01', '2025-01-20', 6050, 0, 24200),
(3, '2024-25', '2024-06-01', '2025-01-20', 6050, 0, 24200),
(4, '2024-25', '2024-06-01', '2025-01-20', 7150, 400, 29000),
(5, '2024-25', '2024-06-01', '2025-01-20', 7150, 400, 29000),
(6, '2024-25', '2024-06-01', '2025-01-20', 7425, 400, 30100),
(7, '2024-25', '2024-06-01', '2025-01-20', 7425, 400, 30100),
(8, '2024-25', '2024-06-01', '2025-01-20', 7700, 400, 31200),
(9, '2024-25', '2024-06-01', '2025-01-20', 7700, 400, 31200),
(10, '2024-25', '2024-06-01', '2025-01-20', 7975, 400, 31900),
(11, '2024-25', '2024-06-01', '2025-01-20', 9900, 400, 40000),
(12, '2024-25', '2024-06-01', '2025-01-20', 10450, 400, 42200),
(13, '2024-25', '2024-06-01', '2024-12-27', 10450, 0, 41800);

DELETE FROM "FeesCollection" WHERE "gradeId" = 1;
DELETE FROM "FeesCollection" WHERE "gradeId" = 4;  -- Repeat for other affected gradeIds

SELECT * FROM "FeeStructure" WHERE "gradeId" = 1;

DELETE FROM "FeesStructure";
WHERE id NOT IN (
  SELECT MIN(id)
  FROM "FeesCollection"
  GROUP BY "studentId", "academicYear", "term"
);

SELECT id, startDate, dueDate FROM "FeesStructure" LIMIT 10;


-- Check fees assigned to this student
SELECT * FROM "FeesCollection" WHERE "studentId" = "16672";

-- Check fees assigned to this grade
SELECT * FROM "FeesCollection" WHERE "gradeId" = 4;

-- Check fees assigned to this grade
SELECT * FROM "FeeTransaction" ;

-- Check fees assigned to this grade
SELECT * FROM "StudentFees" ;

-- Check fees assigned to this grade
SELECT * FROM "StudentFees" WHERE "studentId" = '14355';

SELECT * FROM "StudentFees";	

DELETE FROM "StudentFees";

-- Reset ID sequence
ALTER SEQUENCE "StudentFees_id_seq" RESTART WITH 1;


SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'StudentFees' AND column_name = 'fbNumber';

SELECT * FROM "Student" WHERE id = '17159';

SELECT * FROM "class" WHERE id = 1;

SELECT * FROM "StudentFees" WHERE "paidAmount" > 0;

SELECT * FROM "StudentFees" WHERE "studentId" = '17158';

SELECT * FROM "StudentFees" WHERE "id" = 2;

SELECT * FROM "FeeStructure" ;

SELECT * FROM "StudentFees" WHERE "term" IS NULL;

SELECT * FROM "StudentFees" WHERE term = '';

SELECT DISTINCT "term" FROM "StudentFees";

-- Check fees assigned to this grade
SELECT * FROM "FeeTransaction" ORDER BY id DESC;

SELECT * FROM "FeeTransaction" WHERE "studentId" = '17160';

DELETE FROM "FeeTransaction";

-- Reset ID sequence
ALTER SEQUENCE "FeeTransaction_id_seq" RESTART WITH 1;

-- Check fees assigned to this grade
SELECT * FROM "FeeTransaction" ORDER BY id DESC;

SELECT * FROM "StudentFees" WHERE "studentId" = '17159' ;

SELECT * FROM "StudentTotalFees";

DELETE FROM "StudentTotalFees";
DELETE FROM "StudentTotalFees";

SELECT * FROM "Student" WHERE clerk_id = 'user_2wFMzReXZcEfUSOhp7yzJGkhNRw';
SELECT * FROM "Student";


SELECT * FROM "Messages";
DELETE FROM "Messages";