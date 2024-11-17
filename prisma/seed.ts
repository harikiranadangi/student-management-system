import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Clearing existing data...');
    await prisma.attendance.deleteMany();
    await prisma.result.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacherSubject.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.class.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.grade.deleteMany();

    // Seed Grades
    console.log('Seeding Grades...');
    const grade = await prisma.grade.create({
      data: { level: 1 },
    });

    // Seed Subjects
    console.log('Seeding Subjects...');
    const subjects = ['Math', 'Science', 'History', 'Geography'];
    const createdSubjects = await Promise.all(
      subjects.map((subject) =>
        prisma.subject.create({ data: { name: subject } })
      )
    );
    console.log('Created Subjects:', createdSubjects);  // Log subjects

    // Seed Teachers
    console.log('Seeding Teachers...');
    const teachersData = [];
    for (let i = 1; i <= 40; i++) {
      const teacher = {
        username: `teacher${i}`,
        name: `Teacher ${i}`,
        surname: `Surname ${i}`,
        email: `teacher${i}@school.com`,
        phone: `12345678${String(i).padStart(2, '0')}`,
        address: `Address ${i}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
      };

      const createdTeacher = await prisma.teacher.create({
        data: teacher,
      });

      teachersData.push(createdTeacher);
    }

    console.log('Teachers seeded successfully!');

    // Seed Classes
    console.log('Seeding Classes...');
    const classes = [];
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 4; j++) {
        const sectionName = `${i}${['A', 'B', 'C', 'D'][j - 1]}`;
        const _class = await prisma.class.create({
          data: {
            name: `Class ${i} ${sectionName}`,
            capacity: 30,
            gradeId: grade.id,
          },
        });
        classes.push(_class);
      }
    }

    console.log('Assigning Teachers to Classes...');
    let teacherIndex = 0;
    for (const _class of classes) {
      if (teacherIndex >= teachersData.length) break;

      const teacher = teachersData[teacherIndex];
      teacherIndex++;

      await prisma.class.update({
        where: { id: _class.id },
        data: { supervisorId: teacher.id },
      });

      const assignedSubjects = createdSubjects.slice(0, 2); // Assign first two subjects to teacher
      for (const subject of assignedSubjects) {
        await prisma.teacherSubject.create({
          data: {
            teacherId: teacher.id,
            subjectId: subject.id,
          },
        });
      }

      console.log(`Assigned ${teacher.name} to ${_class.name} with subjects: ${assignedSubjects.map(sub => sub.name).join(', ')}`);
    }

    let studentCounter = 1; // Global counter for unique student usernames

    // Seed Students
    console.log('Seeding Students...');
    for (const _class of classes) {
      for (let i = 1; i <= _class.capacity; i++) {
        const student = await prisma.student.create({
          data: {
            username: `student${studentCounter}`, // Use global counter to ensure uniqueness
            name: `Student ${i}`,
            surname: `Surname ${i}`,
            dob: new Date(2005, 0, 1),
            parentName: `Parent ${i}`,
            email: `student${studentCounter}@school.com`, // Ensure unique email
            phone: `987654321${String(i).padStart(2, '0')}`,
            address: `Address ${i}`,
            bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][i % 8],
            gender: i % 2 === 0 ? 'Male' : 'Female',
            gradeId: grade.id,
            classId: _class.id,
          },
        });

        studentCounter++; // Increment the counter to ensure the next username is unique

        console.log(`Added ${student.name} to ${_class.name}`);
      }
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
