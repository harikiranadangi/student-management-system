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
        surname: "", // Explicitly set to null
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
        surname: "", // Explicitly set to null
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
        surname: "", // Explicitly set to null
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
