import { Day, Gender, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearTable(tableName: string) {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName};`);
}

async function main() {
  try {
    console.log('Clearing existing data...');
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
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
    const subjectNames = [
      'Math', 'Science', 'English', 'History', 'Geography', 
      'Biology', 'Physics', 'Chemistry', 'Economics', 'Art',
    ];
    const subjects = await Promise.all(
      subjectNames.map((name) =>
        prisma.subject.create({
          data: { name },
        })
      )
    );

    // Seed Admins
    const admins = [];
    for (let i = 1; i <= 5; i++) {
      const admin = await prisma.teacher.create({
        data: {
          id: `admin_user_${i}`,
          username: `admin${i}`,
          name: `Admin Name ${i}`,
          surname: `Administrator`,
          email: `admin${i}@school.com`,
          phone: `999999999${i}`,
          address: `Admin Address ${i}`,
          gender: i % 2 === 0 ? Gender.Male : Gender.Female,
          supervisor: true,
        },
      });
      admins.push(admin);
    }

    // Seed Teachers
    const teachers = [];
    for (let i = 1; i <= 50; i++) {
      const teacher = await prisma.teacher.create({
        data: {
          id: `teacher_user_${i}`,
          username: `teacher${i}`,
          name: `Teacher Name ${i}`,
          surname: `Teaching`,
          email: `teacher${i}@school.com`,
          phone: `88888888${i.toString().padStart(2, '0')}`,
          address: `Teacher Address ${i}`,
          gender: i % 2 === 0 ? Gender.Male : Gender.Female,
          supervisor: i <= 20, // First 20 teachers are supervisors
        },
      });
      teachers.push(teacher);
    }

    // Seed Classes
    const classes = [];
    for (const grade of grades) {
      for (let section = 1; section <= 4; section++) {
        const supervisor = teachers[Math.floor(Math.random() * 20)];
        const classItem = await prisma.class.create({
          data: {
            name: `Grade${grade.level}-Section${section}`,
            supervisorId: supervisor.id,
            gradeId: grade.id,
          },
        });
        classes.push(classItem);
      }
    }

    // Seed Students
    const students = [];
    for (const classItem of classes) {
      for (let studentNum = 1; studentNum <= 40; studentNum++) {
        const student = await prisma.student.create({
          data: {
            id: `student_${classItem.id}_${studentNum}`,
            username: `student${classItem.id}_${studentNum}`,
            name: `Student Name ${classItem.id}_${studentNum}`,
            surname: `Learning`,
            parentName: `Parent ${classItem.id}_${studentNum}`,
            phone: `77777777${studentNum.toString().padStart(2, '0')}`,
            address: `Student Address ${classItem.id}_${studentNum}`,
            gender: studentNum % 2 === 0 ? Gender.Male : Gender.Female,
            dob: new Date(2010, 0, studentNum),
            classId: classItem.id,
            gradeId: classItem.gradeId,
          },
        });
        students.push(student);
      }
    }

    // Seed Lessons, Assignments, Exams, Attendance, Announcements, and Events
    for (const classItem of classes) {
      const assignedSubjects = subjects
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // Assign 3 random subjects per class

      const lessons = await Promise.all(
        assignedSubjects.map((subject) =>
          prisma.lesson.create({
            data: {
              name: `Lesson for ${classItem.name} - ${subject.name}`,
              day: Day.MONDAY,
              startTime: new Date('2024-01-01T08:00:00Z'),
              endTime: new Date('2024-01-01T09:00:00Z'),
              classId: classItem.id,
              subjectId: subject.id,
              teacherId: classItem.supervisorId,
            },
          })
        )
      );

      for (const lesson of lessons) {
        // Assignments
        await prisma.assignment.create({
          data: {
            title: `Assignment for ${classItem.name} - ${lesson.name}`,
            startDate: new Date('2024-01-01T10:00:00Z'),
            endDate: new Date('2024-01-01T12:00:00Z'),
            lessonId: lesson.id,
          },
        });

        // Exams
        await prisma.exam.create({
          data: {
            title: `Exam for ${classItem.name} - ${lesson.name}`,
            startTime: new Date('2024-02-01T08:00:00Z'),
            endTime: new Date('2024-02-01T09:00:00Z'),
            lessonId: lesson.id,
          },
        });
      }

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
      for (const student of students.filter((s) => s.classId === classItem.id)) {
        await prisma.attendance.create({
          data: {
            date: new Date(),
            present: Math.random() > 0.2, // Randomly mark as present/absent
            studentId: student.id,
          },
        });
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error while seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
