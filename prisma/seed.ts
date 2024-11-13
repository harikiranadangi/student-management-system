import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Class 1A',
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'Class 1B',
    },
  });

  const class3 = await prisma.class.create({
    data: {
      name: 'Class 2A',
    },
  });

  const class4 = await prisma.class.create({
    data: {
      name: 'Class 2B',
    },
  });

  const class5 = await prisma.class.create({
    data: {
      name: 'Class 3A',
    },
  });

  // Create Teachers
  const teacher1 = await prisma.teachers.create({
    data: {
      username: 'teacher1',  // Unique username
      name: 'John',
      surname: 'Doe',
      gender: 'Male',
      bloodtype: 'O+',
      phone: '1234567890',
      address: '123 School St',
    },
  });

  const teacher2 = await prisma.teachers.create({
    data: {
      username: 'teacher2',  // Unique username
      name: 'Jane',
      surname: 'Smith',
      gender: 'Female',
      bloodtype: 'A+',
      phone: '1234567891',
      address: '124 School St',
    },
  });

  const teacher3 = await prisma.teachers.create({
    data: {
      username: 'teacher3',  // Unique username
      name: 'Michael',
      surname: 'Johnson',
      gender: 'Male',
      bloodtype: 'B+',
      phone: '1234567892',
      address: '125 School St',
    },
  });

  const teacher4 = await prisma.teachers.create({
    data: {
      username: 'teacher4',  // Unique username
      name: 'Emily',
      surname: 'Brown',
      gender: 'Female',
      bloodtype: 'AB+',
      phone: '1234567893',
      address: '126 School St',
    },
  });

  const teacher5 = await prisma.teachers.create({
    data: {
      username: 'teacher5',  // Unique username
      name: 'Chris',
      surname: 'Davis',
      gender: 'Male',
      bloodtype: 'O-',
      phone: '1234567894',
      address: '127 School St',
    },
  });

  // Link Teachers to Classes
  await prisma.class.update({
    where: { id: class1.id },
    data: {
      teacherId: teacher1.id,  // Assign teacher1 to class1
    },
  });

  await prisma.class.update({
    where: { id: class2.id },
    data: {
      teacherId: teacher2.id,  // Assign teacher2 to class2
    },
  });

  await prisma.class.update({
    where: { id: class3.id },
    data: {
      teacherId: teacher3.id,  // Assign teacher3 to class3
    },
  });

  await prisma.class.update({
    where: { id: class4.id },
    data: {
      teacherId: teacher4.id,  // Assign teacher4 to class4
    },
  });

  await prisma.class.update({
    where: { id: class5.id },
    data: {
      teacherId: teacher5.id,  // Assign teacher5 to class5
    },
  });

  // Create Students and associate them with a Class
  const student1 = await prisma.students.create({
    data: {
      name: 'Alice',
      mobileNumber: '9876543210',
      gender: 'Female',
      classId: class1.id, // Assign student to class1
    },
  });

  const student2 = await prisma.students.create({
    data: {
      name: 'Bob',
      mobileNumber: '9876543211',
      gender: 'Male',
      classId: class2.id, // Assign student to class2
    },
  });

  const student3 = await prisma.students.create({
    data: {
      name: 'Charlie',
      mobileNumber: '9876543212',
      gender: 'Male',
      classId: class3.id, // Assign student to class3
    },
  });

  const student4 = await prisma.students.create({
    data: {
      name: 'David',
      mobileNumber: '9876543213',
      gender: 'Male',
      classId: class4.id, // Assign student to class4
    },
  });

  const student5 = await prisma.students.create({
    data: {
      name: 'Eva',
      mobileNumber: '9876543214',
      gender: 'Female',
      classId: class5.id, // Assign student to class5
    },
  });

  // Create Attendance Records
  // Create Attendance Records
  const attendance1 = await prisma.attendance.create({
    data: {
      studentId: 1,
      classId: 1, // Assigning classId here
      status: 'PRESENT',
      createdAt: new Date('2024-10-15T08:00:00Z'),
    },
  });

  const attendance2 = await prisma.attendance.create({
    data: {
      studentId: 2,
      classId: 2, // Assigning classId here
      status: 'PRESENT',
      createdAt: new Date('2024-10-15T08:00:00Z'),
    },
  });

  const attendance3 = await prisma.attendance.create({
    data: {
      studentId: 3,
      classId: 3, // Assigning classId here
      status: 'PRESENT',
      createdAt: new Date('2024-10-15T08:00:00Z'),
    },
  });

  const attendance4 = await prisma.attendance.create({
    data: {
      studentId: 4,
      classId: 4, // Assigning classId here
      status: 'PRESENT',
      createdAt: new Date('2024-10-15T08:00:00Z'),
    },
  });

  const attendance5 = await prisma.attendance.create({
    data: {
      studentId: 5,
      classId: 5, // Assigning classId here
      status: 'PRESENT',
      createdAt: new Date('2024-10-15T08:00:00Z'),
    },
  });

  // Create Payments
  const payment1 = await prisma.payments.create({
    data: {
      studentId: 1,
      amount: 500,
      paymentDate: new Date('2024-10-15'),
      status: 'Paid',
      term: 'TERM_1', // Required field
      recieptDate: new Date('2024-10-15T14:30:00Z'), // Required field
    },
  });

  const payment2 = await prisma.payments.create({
    data: {
      studentId: 2,
      amount: 500,
      paymentDate: new Date('2024-10-16'),
      status: 'Pending',
      term: 'TERM_1', // Required field
      recieptDate: new Date('2024-10-16T14:30:00Z'), // Required field
    },
  });

  const payment3 = await prisma.payments.create({
    data: {
      studentId: 3,
      amount: 500,
      paymentDate: new Date('2024-10-17'),
      status: 'Paid',
      term: 'TERM_1', // Required field
      recieptDate: new Date('2024-10-17T14:30:00Z'), // Required field
    },
  });

  const payment4 = await prisma.payments.create({
    data: {
      studentId: 4,
      amount: 500,
      paymentDate: new Date('2024-10-18'),
      status: 'Paid',
      term: 'TERM_1', // Required field
      recieptDate: new Date('2024-10-18T14:30:00Z'), // Required field
    },
  });

  const payment5 = await prisma.payments.create({
    data: {
      studentId: 5,
      amount: 500,
      paymentDate: new Date('2024-10-19'),
      status: 'Pending',
      term: 'TERM_1', // Required field
      recieptDate: new Date('2024-10-19T14:30:00Z'), // Required field
    },
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
