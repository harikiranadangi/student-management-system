SELECT s.id, s.name, s.classId, c.id AS class_id, c.name AS class_name 
FROM student s
LEFT JOIN class c ON s.classId = c.id;
