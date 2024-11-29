import { Day, Gender, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to truncate tables and reset auto-increment counters
async function clearTable(tableName: string) {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName};`);
}

async function main() {
  try {
    console.log('Clearing existing data...');
    // Disable foreign key checks (optional, use if truncating causes foreign key issues)
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

    // Clear existing data
    const tables = [
      'Attendance',
      'Result',
      'Student',
      'Class',
      'Teacher',
      'Subject',
      'Grade',
      'Announcement',
      'Assignment',
      'Event',
      'Exam',
      'Lesson',
    ];

    for (const table of tables) {
      await clearTable(table);
    }

    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Seeding data...');

    // Seed Grades
    const grades = [];
    for (let i = 1; i <= 10; i++) {
      const grade = await prisma.grade.create({
        data: { level: i },
      });
      grades.push(grade);
    }

    // Seed Subjects
    const subjectNames = ['Math', 'Science', 'English', 'History', 'Geography', 'Biology', 'Physics', 'Chemistry', 'Economics', 'Art'];
    const subjects = await Promise.all(
      subjectNames.map((name) =>
        prisma.subject.create({
          data: { name },
        })
      )
    );

    // Seed Teachers
    const teachers = [];
    for (let i = 1; i <= 50; i++) {
      const teacher = await prisma.teacher.create({
        data: {
          username: `teacher${i}`,
          name: `Teacher Name ${i}`,
          surname: `Surname ${i}`,
          email: `teacher${i}@school.com`,
          phone: `98765432${(i % 10).toString().padStart(2, '0')}`,
          address: `Teacher Address ${i}`,
          gender: i % 2 === 0 ? Gender.Male : Gender.Female,
          supervisor: i <= 40, // First 40 teachers are supervisors
        },
      });
      teachers.push(teacher);
    }

    // Assign Subjects to Teachers (Max 2 per teacher)
    for (const teacher of teachers) {
      const assignedSubjects = subjects
        .sort(() => 0.5 - Math.random()) // Shuffle subjects
        .slice(0, 2); // Pick 2 subjects
      for (const subject of assignedSubjects) {
        await prisma.subject.update({
          where: { id: subject.id },
          data: {
            teachers: {
              connect: { id: teacher.id },
            },
          },
        });
      }
    }

    // Seed Classes and link to Grades and Supervisors
    const classes = [];
    for (const grade of grades) {
      for (let j = 1; j <= 4; j++) {
        const supervisor = teachers[Math.floor(Math.random() * 40)]; // Random supervisor from first 40
        const classItem = await prisma.class.create({
          data: {
            name: `Grade${grade.level}-Section${j}`,
            supervisorId: supervisor.id,
            gradeId: grade.id,
          },
        });
        classes.push(classItem);
      }
    }

    // Seed Students and link to Classes and Grades
    for (const classItem of classes) {
      for (let k = 1; k <= 10; k++) {
        await prisma.student.create({
          data: {
            username: `student${classItem.id}-${k}`,
            name: `Student Name ${classItem.id}-${k}`,
            surname: `Student Surname ${classItem.id}-${k}`,
            parentName: `Parent ${classItem.id}-${k}`,
            phone: `98765432${(k % 10).toString().padStart(2, '0')}`,
            address: `Student Address ${classItem.id}-${k}`,
            gender: k % 2 === 0 ? Gender.Male : Gender.Female,
            dob: new Date(2010, 0, k),
            classId: classItem.id,
            gradeId: classItem.gradeId,
          },
        });
      }
    }

    // Seed Lessons, Assignments, Exams, Attendance, Announcements, and Events for each Class
    for (const classItem of classes) {
      // Lessons
      const lesson = await prisma.lesson.create({
        data: {
          name: `Lesson for ${classItem.name}`,
          day: Day.MONDAY,
          startTime: new Date('2024-01-01T08:00:00Z'),
          endTime: new Date('2024-01-01T09:00:00Z'),
          classId: classItem.id,
          subjectId: subjects[Math.floor(Math.random() * subjects.length)].id,
          teacherId: classItem.supervisorId,
        },
      });

      // Assignments
      await prisma.assignment.create({
        data: {
          title: `Assignment for ${classItem.name}`,
          startDate: new Date('2024-01-01T10:00:00Z'), // Updated field
          endDate: new Date('2024-01-01T12:00:00Z'),   // Updated field
          lessonId: lesson.id,
        },
      });


      // Exams
      await prisma.exam.create({
        data: {
          title: `Exam for ${classItem.name}`,
          startTime: new Date('2024-02-01T08:00:00Z'),
          endTime: new Date('2024-02-01T09:00:00Z'),
          lessonId: lesson.id,
        },
      });

      // Announcements
      await prisma.announcement.create({
        data: {
          title: `Announcement for ${classItem.name}`,
          description: `This is an announcement for ${classItem.name}`,
          date: new Date(),
          classId: classItem.id,
        },
      });

      // Events
      await prisma.event.create({
        data: {
          title: `Event for ${classItem.name}`,
          description: `This is an event for ${classItem.name}`,
          startTime: new Date('2024-03-01T08:00:00Z'),
          endTime: new Date('2024-03-01T10:00:00Z'),
          classId: classItem.id,
        },
      });

      // Attendance
      for (let k = 1; k <= 10; k++) {
        const student = await prisma.student.findFirst({
          where: { classId: classItem.id },
        });
        await prisma.attendance.create({
          data: {
            date: new Date(),
            present: Math.random() > 0.2, // 80% chance of being present
            studentId: student?.id!,
          },
        });
      }
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error while seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
