import { PrismaClient } from '@prisma/client';

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
    await clearTable('Attendance');
    await clearTable('Result');
    await clearTable('Student');
    await clearTable('Class');
    await clearTable('Teacher');
    await clearTable('Subject');
    await clearTable('Grade');
    await clearTable('Announcement');
    await clearTable('Assignment');
    await clearTable('Event');
    await clearTable('Exam');
    await clearTable('Homework');

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
              connect: assignedSubjects.map((subject) => ({
                id: subject.id,
              })),
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

        // Seed Attendance
        await prisma.attendance.create({
          data: {
            date: new Date(),
            present: Math.random() > 0.5,
            studentId: student.id,
          },
        });

        // Seed Results
        await prisma.result.create({
          data: {
            score: Math.floor(Math.random() * 100),
            studentId: student.id,
          },
        });
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
