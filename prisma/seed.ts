import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ✅ Ensure the grade table is populated first
  console.log("🔍 Checking if grade data exists...");
  const gradeCount = await prisma.grade.count();
  if (gradeCount === 0) {
    console.log("🛠️  Inserting grades...");

    await prisma.grade.createMany({
      data: [
        { id: 1, level: 1 }, // Pre KG to UKG
        { id: 2, level: 2 },      // Grades I to V
        { id: 3, level: 3 },       // Grades VI to X
      ],
    });

    console.log("✅ Grades inserted successfully!");
  } else {
    console.log("✅ Grades already exist, skipping insertion.");
  }

  // ✅ Ensure the class table is seeded after grades exist
  console.log("🔍 Checking if class data exists...");
  const classCount = await prisma.class.count();
  if (classCount === 0) {
    console.log("🛠️  Inserting classes...");

    await prisma.class.createMany({
      data: [
        { name: "Pre KG", supervisorId: null, gradeId: 1 },
        { name: "LKG", supervisorId: null, gradeId: 1 },
        { name: "UKG", supervisorId: null, gradeId: 1 },
        { name: "Grade I", supervisorId: null, gradeId: 2 },
        { name: "Grade II", supervisorId: null, gradeId: 2 },
        { name: "Grade III", supervisorId: null, gradeId: 2 },
        { name: "Grade IV", supervisorId: null, gradeId: 2 },
        { name: "Grade V", supervisorId: null, gradeId: 2 },
        { name: "Grade VI", supervisorId: null, gradeId: 3 },
        { name: "Grade VII", supervisorId: null, gradeId: 3 },
        { name: "Grade VIII", supervisorId: null, gradeId: 3 },
        { name: "Grade IX", supervisorId: null, gradeId: 3 },
        { name: "Grade X", supervisorId: null, gradeId: 3 },
      ],
    });

    console.log("✅ Classes inserted successfully!");
  } else {
    console.log("✅ Classes already exist, skipping insertion.");
  }

  // ✅ Ensure students are inserted after classes exist
  console.log("🔍 Loading student data...");
  const students = await import("./students.json").then(module => module.default);

  console.log(`🧐 Sample student object:`, students[0]);

  console.log("🛠️  Inserting students into the database...");
const updatedStudents = students.map(student => ({
  ...student,
  gender: student.gender === "Male" ? "Male" : "Female" as Prisma.student_gender, // Convert to enum
  dob: new Date(student.dob), // Convert DOB to Date object
}));

await prisma.student.createMany({
  data: updatedStudents,
});



  // console.log(`✅ Students inserted successfully: ${result.count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error inserting data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
