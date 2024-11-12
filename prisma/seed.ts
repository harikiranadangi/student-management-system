import { PrismaClient, Grade, Term } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed 10 Teachers
  const teachers = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.teachers.create({
        data: {
          name: `Teacher ${i + 1}`,
          email: `teacher${i + 1}@example.com`,
          mobileNumber: `12345678${i + 1}`,
        },
      })
    )
  );

  // Seed 10 Students with random grades and assign them to a teacher
  const students = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.students.create({
        data: {
          name: `Student ${i + 1}`,
          grade: Object.values(Grade)[i % Object.values(Grade).length],
          mobileNumber: `98765432${i + 1}`,
          dateOfBirth: new Date(`2010-0${i + 1}-15`),
          address: `Address ${i + 1}`,
          teacherId: teachers[i % teachers.length].id, // Assign to a teacher
        },
      })
    )
  );

  // Seed 10 ClassSchedules with random days and times
  const classSchedules = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.classSchedule.create({
        data: {
          lessonId: i + 1,
          teacherId: teachers[i % teachers.length].id,
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i % 5],
          startTime: new Date(`2024-01-01T0${i % 9}:00:00.000Z`),
          endTime: new Date(`2024-01-01T0${(i % 9) + 1}:00:00.000Z`),
          frequency: "Weekly",
        },
      })
    )
  );

  // Seed 10 Attendance records for each student in different classes
  const attendanceRecords = await Promise.all(
    students.flatMap((student, i) =>
      Array.from({ length: 10 }, (_, j) =>
        prisma.attendance.create({
          data: {
            studentId: student.id,
            classId: classSchedules[j % classSchedules.length].id,
            status: j % 2 === 0 ? "Present" : "Absent",
          },
        })
      )
    )
  );

  // Seed 10 Payments per student, one for each term
  const payments = await Promise.all(
    students.flatMap((student, i) =>
      Array.from({ length: 4 }, (_, j) =>
        prisma.payments.create({
          data: {
            studentId: student.id,
            amount: 1000 + j * 500,
            paymentDate: new Date(),
            status: j % 2 === 0 ? "Completed" : "Pending",
            term: Object.values(Term)[j % Object.values(Term).length],
          },
        })
      )
    )
  );

  // Seed 10 TeacherAssignments linking teachers to students with subjects
  const teacherAssignments = await Promise.all(
    students.flatMap((student, i) =>
      Array.from({ length: 10 }, (_, j) =>
        prisma.teacherAssignments.create({
          data: {
            teacherId: teachers[j % teachers.length].id,
            studentId: student.id,
            subject: ["Mathematics", "Science", "History", "Art"][j % 4],
          },
        })
      )
    )
  );

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
