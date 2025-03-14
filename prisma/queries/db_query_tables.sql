-- Retrieve all table names from the public schema
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Generate SELECT queries for all tables in the public schema
SELECT 'SELECT * FROM ' || tablename || ';'  
FROM pg_tables  
WHERE schemaname = 'public';

CREATE TABLE Admin (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Announcement (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    classId INT REFERENCES Class(id) ON DELETE SET NULL
);

CREATE TABLE Attendance (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    present BOOLEAN NOT NULL,
    studentId TEXT REFERENCES Student(id) ON DELETE CASCADE,
    classId INT REFERENCES Class(id) ON DELETE CASCADE
);

CREATE TABLE Class (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    supervisorId TEXT UNIQUE REFERENCES Teacher(id),
    gradeId INT REFERENCES Grade(id) ON DELETE CASCADE
);

CREATE TABLE Event (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    classId INT REFERENCES Class(id) ON DELETE SET NULL
);

CREATE TABLE Exam (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    classId INT REFERENCES Class(id) ON DELETE CASCADE
);

CREATE TABLE ExamSubject (
    id SERIAL PRIMARY KEY,
    examId INT REFERENCES Exam(id) ON DELETE CASCADE,
    subjectId INT REFERENCES Subject(id) ON DELETE CASCADE,
    maxMarks INT NOT NULL,
    UNIQUE(examId, subjectId)
);

CREATE TABLE Fee (
    id SERIAL PRIMARY KEY,
    studentId TEXT REFERENCES Student(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    amount INT NOT NULL,
    extraFee INT DEFAULT 0,
    totalFee INT NOT NULL,
    dueAmount INT NOT NULL,
    paidAmount INT DEFAULT 0,
    status TEXT DEFAULT 'Not Paid',
    feesbook TEXT NOT NULL,
    dueDate TIMESTAMP NOT NULL,
    paidDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(studentId, term)
);

CREATE TABLE FeesStructure (
    id SERIAL PRIMARY KEY,
    classId INT UNIQUE REFERENCES Class(id) ON DELETE CASCADE,
    totalFees INT NOT NULL,
    abacusFees INT NOT NULL,
    termFees INT NOT NULL
);

CREATE TABLE Grade (
    id SERIAL PRIMARY KEY,
    level TEXT UNIQUE NOT NULL
);

CREATE TABLE Homework (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    Date TIMESTAMP NOT NULL,
    classId INT REFERENCES Class(id) ON DELETE CASCADE,
    subjectId INT REFERENCES Subject(id) ON DELETE CASCADE
);

CREATE TABLE Lesson (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    day TEXT NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    subjectId INT REFERENCES Subject(id) ON DELETE CASCADE,
    classId INT REFERENCES Class(id) ON DELETE CASCADE,
    teacherId TEXT REFERENCES Teacher(id) ON DELETE CASCADE
);

CREATE TABLE Result (
    id SERIAL PRIMARY KEY,
    score FLOAT NOT NULL,
    studentId TEXT REFERENCES Student(id) ON DELETE CASCADE,
    examId INT REFERENCES Exam(id) ON DELETE CASCADE,
    subjectId INT REFERENCES Subject(id) ON DELETE CASCADE
);

CREATE TABLE Student (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    parentName TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    img TEXT,
    bloodType TEXT,
    gender TEXT NOT NULL,
    dob TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP,
    classId INT REFERENCES Class(id) ON DELETE CASCADE,
    clerk_id TEXT UNIQUE
);

CREATE TABLE Subject (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Teacher (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    img TEXT,
    bloodType TEXT,
    gender TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP,
    supervisor BOOLEAN DEFAULT FALSE,
    dob TIMESTAMP,
	classId TEXT UNIQUE,
	CONSTRAINT teacher_username_unique UNIQUE (username),
    CONSTRAINT teacher_email_unique UNIQUE (email),
    CONSTRAINT teacher_classId_unique UNIQUE (classId)
);

CREATE TABLE ClerkUser (
    clerk_id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    studentId TEXT UNIQUE REFERENCES Student(id) ON DELETE CASCADE,
    teacherId TEXT UNIQUE REFERENCES Teacher(id) ON DELETE CASCADE,
    CHECK (
        (studentId IS NOT NULL AND teacherId IS NULL) OR 
        (studentId IS NULL AND teacherId IS NOT NULL)
    )
);


CREATE TABLE IF NOT EXISTS ClerkUser (
    id VARCHAR PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    full_name VARCHAR NOT NULL,
	role VARCHAR NOT NULL
);

SELECT * FROM "ClerkUser";
DROP TABLE IF EXISTS "ClerkUser" CASCADE;


SELECT *
FROM "Student" s
JOIN "ClerkUser" cu ON s.id = cu.clerk_id
WHERE cu.username = 's14384A';

SELECT * FROM "ClerkUser" WHERE username = 's14384A';





-- "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d kotakdatabase

DELETE FROM ClerkUser;

SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ClerkUser';

 SELECT id, username, clerk_id FROM "Student" WHERE clerk_id = 'user_2u7uazlBqLYKlsChmAcRyf32DkH';


COPY "ClerkUser"(clerk_id, username, password, full_name, role)
FROM 'D:/GITHUB/student-management-system/data_tables/data-1741517708840.csv'
WITH CSV HEADER DELIMITER ',';

SELECT * FROM "Student";

SELECT * FROM "Admin";

SELECT * FROM "Student" WHERE clerk_id IS NOT  NULL; 

SELECT * FROM "ClerkUser" WHERE user_id IS NOT NULL;


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


SELECT * FROM "Teacher" WHERE id = 'user_2u2pXhmNqzsHVzrbD2WbjYYfLsO';

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

-- DELETE FROM "Teacher";


COPY "Teacher" (id, username, name, surname, email, phone, address, img, "bloodType", gender, dob, "classId")
FROM 'D:/GITHUB/student-management-system/data_tables/teacher_data.csv'
DELIMITER ',' 
CSV HEADER;

SELECT "Teacher"."name", "class"."name"
FROM "Teacher"
LEFT JOIN "class" ON "Teacher"."id" = "class"."supervisorId";

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



