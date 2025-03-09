-- Retrieve all table names from the public schema
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Generate SELECT queries for all tables in the public schema
SELECT 'SELECT * FROM ' || tablename || ';'  
FROM pg_tables  
WHERE schemaname = 'public';

-- View all migration records from Prisma's migration table
SELECT * FROM _prisma_migrations;

-- Retrieve all records from the Admin table
SELECT * FROM Admin;

-- Retrieve all records from the class table
SELECT * FROM class;

-- Retrieve all records from the Announcement table (incorrect syntax - should use double quotes)
SELECT * FROM "Announcement";

-- Retrieve all records from the Student table
SELECT * FROM "Student";

SELECT * FROM "Student" 
ORDER BY "classId" ASC, "gender" DESC, "name" ASC;



-- Retrieve all records from the Grade table
SELECT * FROM "Grade";

-- Retrieve all records from the Teacher table
SELECT * FROM "Teacher";

-- Retrieve all records from the Event table
SELECT * FROM "Event";

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



