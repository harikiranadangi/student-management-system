-- Retrieve all table names from the public schema
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Generate SELECT queries for all tables in the public schema
SELECT 'SELECT * FROM ' || tablename || ';'  
FROM pg_tables  
WHERE schemaname = 'public';

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';



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

COPY "ClerkStudents"(clerk_id, username, password, full_name, role, "studentId")
FROM 'D:/GITHUB/student-management-system/data/clerk_student_data.csv'
WITH CSV HEADER DELIMITER ',';

SELECT * FROM "ClerkStudents";

DELETE FROM "ClerkStudents";

-- Clerk Teachers

COPY "ClerkTeachers"(clerk_id, username, password, full_name, role, "studentId")
FROM 'D:/GITHUB/student-management-system/data/clerk_teacher_data.csv'
WITH CSV HEADER DELIMITER ',';

SELECT * FROM "ClerkTeachers";

DELETE FROM "ClerkTeachers";

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
SELECT * FROM Admin;

-- Retrieve all records from the class table
SELECT * FROM class;

SELECT column_name FROM information_schema.columns WHERE table_name = 'class';


SELECT * FROM "Teacher" WHERE id = 'T1';
SELECT * FROM "Grade" WHERE id = 1;
SELECT * FROM "class" ;

SELECT "supervisorId" FROM "class" LIMIT 5;


SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'class' AND column_name = 'supervisorId';



SELECT setval('"class_id_seq"', (SELECT MAX(id) FROM "class"));


SELECT * FROM "teacher" WHERE id = 'user_2u2pXhmNqzsHVzrbD2WbjYYfLsO';

-- Retrieve all records from the Announcement table (incorrect syntax - should use double quotes)
SELECT * FROM "Announcement";

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


COPY "Teacher" (id, username, name, surname, email, phone, address, img, "bloodType", gender, dob, "classId")
FROM 'D:/GITHUB/student-management-system/NewFolder/teacher_data.csv'
DELIMITER ',' 
CSV HEADER;

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

-- Retrieve all records from the FeesStructure table
SELECT * FROM "FeesStructure";

-- Retrieve all records from the StudentFees table
SELECT * FROM "StudentFees";

-- Retrieve all records from the TeacherSubject table
SELECT * FROM "TeacherSubject";



