import { Day, PrismaClient } from '@prisma/client';

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

    // Clear existing data and reset auto-increment counters
    const tables = [
      'Attendance', 'Result', 'Student', 'Class', 'Teacher', 'Subject', 'Grade', 
      'Announcement', 'Assignment', 'Event', 'Exam', 'Homework'
    ];
    
    for (const table of tables) {
      await clearTable(table);
    }

    // Re-enable foreign key checks
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');

    // Seed Grades
    console.log('Seeding Grades...');
    const grade = await prisma.grade.create({
      data: { level: 1 },
    });

    // Seed Subjects
    console.log('Seeding Subjects...');
    const subjects = ['Math', 'Science', 'History', 'Geography', 'English', 'Physical Education'];
    const createdSubjects = await Promise.all(
      subjects.map((subject) => prisma.subject.create({ data: { name: subject } }))
    );

    // Seed Teachers and assign a maximum of 2 subjects each
    console.log('Seeding Teachers...');
    const teachers = await Promise.all(
      Array.from({ length: 40 }, (_, i) => {
        const assignedSubjects = [
          createdSubjects[i % createdSubjects.length],
          createdSubjects[(i + 1) % createdSubjects.length],
        ];

        return prisma.teacher.create({
          data: {
            username: `teacher${i + 1}`,
            name: `Teacher ${i + 1}`,
            surname: `Surname ${i + 1}`,
            email: `teacher${i + 1}@school.com`,
            phone: `12345678${String(i + 1).padStart(2, '0')}`,
            address: `Address ${i + 1}`,
            gender: i % 2 === 0 ? 'Male' : 'Female',
            subjects: {
              connect: assignedSubjects.map((subject) => ({ id: subject.id })),
            },
          },
        });
      })
    );

    // Seed Classes
    console.log('Seeding Classes...');
    const classes = [];
    for (let i = 1; i <= 10; i++) {
      const section = ['A', 'B', 'C', 'D'];
      for (let j = 0; j < section.length; j++) {
        const supervisor = teachers[(i * 4 + j) % teachers.length];
        const _class = await prisma.class.create({
          data: {
            name: `Class ${i}${section[j]}`,
            gradeId: grade.id,
            supervisorId: supervisor.id,
          },
        });
        classes.push(_class);
      }
    }

    // Seed Homework
    console.log('Seeding Homework...');
    for (const _class of classes) {
      const homework = await prisma.homework.create({
        data: {
          description: `Homework for ${_class.name}`,
          class: { connect: { id: _class.id } },
          subject: { connect: { id: createdSubjects[0].id } },
        },
      });
      console.log(`Homework created for ${_class.name}`);
    }

    // Seed Students
    console.log('Seeding Students...');
    let studentCounter = 1;
    for (const _class of classes) {
      for (let i = 1; i <= 10; i++) {
        const student = await prisma.student.create({
          data: {
            id: studentCounter,
            username: `student${studentCounter}`,
            name: `Student ${studentCounter}`,
            surname: `Surname ${studentCounter}`,
            parentName: `Parent ${studentCounter}`,
            email: `student${studentCounter}@school.com`,
            phone: `98765432${String(studentCounter).padStart(2, '0')}`,
            dob: new Date(2005, i % 12, i % 28 + 1),
            address: `Address ${studentCounter}`,
            bloodType: ['A+', 'B+', 'AB+', 'O+'][i % 4],
            gender: i % 2 === 0 ? 'Male' : 'Female',
            gradeId: grade.id,
            classId: _class.id,
          },
        });
        studentCounter++;

        // Seed Attendance and Results in parallel for better performance
        await Promise.all([
          prisma.attendance.create({
            data: {
              date: new Date(),
              present: Math.random() > 0.5,
              studentId: student.id,
            },
          }),
          prisma.result.create({
            data: {
              score: Math.floor(Math.random() * 100),
              studentId: student.id,
            },
          }),
        ]);
      }
    }

    // Seed Lessons
    console.log('Seeding Lessons...');
    for (const _class of classes) {
      // Assign lessons to the class
      for (let i = 0; i < 5; i++) { // You can set the number of lessons you want per class
        const teacher = teachers[i % teachers.length];  // Assign a teacher
        const subject = createdSubjects[i % createdSubjects.length];  // Assign a subject

        // Create a random day from the Day enum
        const days = Object.values(Day);
        const randomDay: Day = days[i % days.length];  // Assign random day

        const lesson = await prisma.lesson.create({
          data: {
            name: `Lesson ${i + 1} for ${_class.name}`,
            day: randomDay, // Correctly assign the random day
            startTime: new Date(2024, 0, 1, 8 + i, 0), // Example start time
            endTime: new Date(2024, 0, 1, 9 + i, 0), // Example end time (1 hour per lesson)
            classId: _class.id,
            subjectId: subject.id,
            teacherId: teacher.id,
          },
        });
        console.log(`Lesson ${lesson.name} created for ${_class.name} by ${teacher.name}`);
      }
    }

    console.log('Seeding process completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
