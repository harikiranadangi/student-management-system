import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Clearing existing data...');
    // Clear existing data in the correct order
    await prisma.attendance.deleteMany();
    await prisma.result.deleteMany();
    await prisma.student.deleteMany();
    await prisma.class.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.grade.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.event.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.homework.deleteMany();

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

    // Seed Teachers
    const teachers = await Promise.all(
      Array.from({ length: 40 }, (_, i) =>
        prisma.teacher.create({
          data: {
            username: `teacher${i + 1}`,
            name: `Teacher ${i + 1}`,
            surname: `Surname ${i + 1}`,
            email: `teacher${i + 1}@school.com`,
            phone: `12345678${String(i + 1).padStart(2, '0')}`,
            address: `Address ${i + 1}`,
            gender: i % 2 === 0 ? 'Male' : 'Female',
          },
        })
      )
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
          subject: { connect: { id: createdSubjects[0].id } }, // Linking the first subject
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
            id: `student${studentCounter}`,
            username: `student${studentCounter}`,
            name: `Student ${studentCounter}`,
            surname: `Surname ${studentCounter}`,
            email: `student${studentCounter}@school.com`,
            phone: `98765432${String(studentCounter).padStart(2, '0')}`,
            addresss: `Address ${studentCounter}`,
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
