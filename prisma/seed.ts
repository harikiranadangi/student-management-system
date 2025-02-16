import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  // Read the students.json file
  const students = JSON.parse(fs.readFileSync('D:/GITHUB/student-management-system/prisma/students.json', 'utf-8'));

  console.log(`ℹ️  Inserting ${students.length} students...`);

  // Insert data into the Student table
  await prisma.student.createMany({
    data: students,
    skipDuplicates: true, // Avoids errors if duplicate IDs exist
  });

  console.log("✅ Students inserted successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error inserting students:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
