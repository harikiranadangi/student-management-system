SELECT tablename FROM pg_tables WHERE schemaname = 'public';

SELECT 'SELECT * FROM ' || tablename || ';' 
FROM pg_tables 
WHERE schemaname = 'public';

SELECT * FROM _prisma_migrations;
SELECT * FROM Admin;
SELECT * FROM class;
SELECT * FROM 'Announcement';
SELECT * FROM "Student";

SELECT * FROM "Grade";
SELECT * FROM "Teacher";
SELECT * FROM "Event";
SELECT * FROM "Exam";
SELECT * FROM "ExamSubject";
SELECT * FROM "Subject";
SELECT * FROM "Fee";
SELECT * FROM "Homework";
SELECT * FROM "Lesson";
SELECT * FROM "Result";
SELECT * FROM "Attendance";
SELECT * FROM "FeesStructure";
SELECT * FROM "StudentFees";
SELECT * FROM "TeacherSubject";
