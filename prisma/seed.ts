import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Insert Grade Data
  await prisma.grade.createMany({
    data: [
      { id: 1, level: "Pre KG" },
      { id: 2, level: "LKG" },
      { id: 3, level: "UKG" },
      { id: 4, level: "I" },
      { id: 5, level: "II" },
      { id: 6, level: "III" },
      { id: 7, level: "IV" },
      { id: 8, level: "V" },
      { id: 9, level: "VI" },
      { id: 10, level: "VII" },
      { id: 11, level: "VIII" },
      { id: 12, level: "IX" },
      { id: 13, level: "X" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Grades seeded");

  // Insert Class Data
  await prisma.class.createMany({
    data: [
      { id: 1, name: "Pre KG", gradeId: 1 },
      { id: 2, name: "LKG - A", gradeId: 2 },
      { id: 3, name: "LKG - B", gradeId: 2 },
      { id: 4, name: "UKG - A", gradeId: 3 },
      { id: 5, name: "UKG - B", gradeId: 3 },
      { id: 6, name: "UKG - C", gradeId: 3 },
      { id: 7, name: "I - A", gradeId: 4 },
      { id: 8, name: "I - B", gradeId: 4 },
      { id: 9, name: "I - C", gradeId: 4 },
      { id: 10, name: "I - D", gradeId: 4 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Classes seeded");

  // Insert Students Data
  await prisma.student.createMany({
    data: [
      {
        id: "S1",
        username: "student1",
        name: "John",
        surname: "",
        parentName: "Michael Doe",
        phone: "9876543210",
        address: "123 Street, City",
        gender: "Male",
        dob: new Date("2015-06-15"),
        classId: 7,
      },
      {
        id: "S2",
        username: "student2",
        name: "Emma",
        surname: "",
        parentName: "Sarah Smith",
        phone: "9876543222",
        address: "456 Avenue, City",
        gender: "Female",
        dob: new Date("2014-05-20"),
        classId: 8,
      },
      {
        id: "S3",
        username: "student3",
        name: "Liam",
        surname: "",
        parentName: "David Johnson",
        phone: "9876543233",
        address: "789 Boulevard, City",
        gender: "Male",
        dob: new Date("2013-09-10"),
        classId: 9,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Students seeded");

  // Insert Teachers Data
  await prisma.teacher.createMany({
    data: [
      {
        id: "T1",
        username: "teacher1",
        name: "Alice",
        surname: "Brown",
        email: "alice@example.com",
        phone: "9876541111",
        address: "100 Main St, City",
        img: null,
        bloodType: "A+",
        gender: "Female",
        createdAt: new Date(),
        deletedAt: null,
        supervisor: false,
        dob: new Date("1985-03-25"),
      },
      {
        id: "T2",
        username: "teacher2",
        name: "Robert",
        surname: "Williams",
        email: "robert@example.com",
        phone: "9876542222",
        address: "200 Elm St, City",
        img: null,
        bloodType: "O+",
        gender: "Male",
        createdAt: new Date(),
        deletedAt: null,
        supervisor: true,
        dob: new Date("1978-11-15"),
      },
      {
        id: "T3",
        username: "teacher3",
        name: "Sophia",
        surname: "Davis",
        email: "sophia@example.com",
        phone: "9876543333",
        address: "300 Oak St, City",
        img: null,
        bloodType: "B+",
        gender: "Female",
        createdAt: new Date(),
        deletedAt: null,
        supervisor: false,
        dob: new Date("1990-07-30"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Teachers seeded");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  // npx tsx prisma/seed.ts