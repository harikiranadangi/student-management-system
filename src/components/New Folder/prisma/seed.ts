import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding Admins...');
    for (let i = 1; i <= 10; i++) {
      console.log(`Creating admin ${i}`);
      await prisma.admin.create({
        data: {
          username: `admin${i}`,
        },
      });
    }

    console.log('Seeding Grades...');
    for (let i = 1; i <= 10; i++) {
      console.log(`Creating grade ${i}`);
      await prisma.grade.create({
        data: {
          level: i,
        },
      });
    }

    console.log('Seeding Classes...');
    const grades = await prisma.grade.findMany();
    for (let i = 1; i <= 10; i++) {
      console.log(`Creating class ${i}`);
      await prisma.class.create({
        data: {
          name: `Class ${i}`,
          gradeId: grades[i % grades.length].id,
          capacity: 30,
        },
      });
    }

    console.log('Seeding Subjects...');
    const classes = await prisma.class.findMany();
    for (let i = 1; i <= 10; i++) {
      console.log(`Creating subject ${i}`);
      await prisma.subject.create({
        data: {
          name: `Subject ${i}`,
        },
      });
    }

    console.log('Seeding Teachers...');
    const subjects = await prisma.subject.findMany();
    for (let i = 1; i <= 10; i++) {
      console.log(`Creating teacher ${i}`);
      await prisma.teacher.create({
        data: {
          username: `teacher${i}`,
          name: `Teacher ${i}`,
          surname: `Surname ${i}`,
          email: `teacher${i}@school.com`,
          phone: `123456789${i}`,
          address: `Address ${i}`,
          gender: i % 2 === 0 ? 'Male' : 'Female',
        },
      });
    }

    console.log('Seeding Students...');
    const teachers = await prisma.teacher.findMany();
    for (let i = 1; i <= 10; i++) {
      console.log(`Creating student ${i}`);
      await prisma.student.create({
        data: {
          username: `student${i}`,
          name: `Student ${i}`,
          surname: `Surname ${i}`,
          email: `student${i}@school.com`,
          phone: `987654321${i}`,
          address: `Address ${i}`,
          bloodType: i % 2 === 0 ? 'A+' : 'O+',
          gender: i % 2 === 0 ? 'Male' : 'Female',
          gradeId: grades[i % grades.length].id,
          classId: classes[i % classes.length].id,
        },
      });
    }

    console.log('Seeding complete!');
  } catch (e) {
    console.error('Error during seeding:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Unexpected error:', e);
    process.exit(1);
  });
