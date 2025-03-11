import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();


async function main() {
  console.log("🔄 Deleting existing data...");

  // Delete in correct order to maintain referential integrity
   await prisma.teacher.deleteMany();
  //await prisma.student.deleteMany();
  // await prisma.class.deleteMany();
  // await prisma.subject.deleteMany();
  // await prisma.grade.deleteMany();

  console.log("✅ Existing data deleted");

  console.log("📌 Seeding data...");

  // ✅ Seed Grades
  const gradesData = [
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
  ];
  await prisma.grade.createMany({ data: gradesData, skipDuplicates: true });
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
      { id: 11, name: "II - A", gradeId: 5 },
      { id: 12, name: "II - B", gradeId: 5 },
      { id: 13, name: "II - C", gradeId: 5 },
      { id: 14, name: "II - D", gradeId: 5 },
      { id: 15, name: "III - A", gradeId: 6 },
      { id: 16, name: "III - B", gradeId: 6 },
      { id: 17, name: "III - C", gradeId: 6 },
      { id: 18, name: "III - D", gradeId: 6 },
      { id: 19, name: "IV - A", gradeId: 7 },
      { id: 20, name: "IV - B", gradeId: 7 },
      { id: 21, name: "IV - C", gradeId: 7 },
      { id: 22, name: "IV - D", gradeId: 7 },
      { id: 23, name: "V - A", gradeId: 8 },
      { id: 24, name: "V - B", gradeId: 8 },
      { id: 25, name: "V - C", gradeId: 8 },
      { id: 26, name: "V - D", gradeId: 8 },
      { id: 27, name: "VI - A", gradeId: 9 },
      { id: 28, name: "VI - B", gradeId: 9 },
      { id: 29, name: "VI - C", gradeId: 9 },
      { id: 30, name: "VI - D", gradeId: 9 },
      { id: 31, name: "VII - A", gradeId: 10 },
      { id: 32, name: "VII - B", gradeId: 10 },
      { id: 33, name: "VII - C", gradeId: 10 },
      { id: 34, name: "VII - D", gradeId: 10 },
      { id: 35, name: "VIII - A", gradeId: 11 },
      { id: 36, name: "VIII - B", gradeId: 11 },
      { id: 37, name: "VIII - C", gradeId: 11 },
      { id: 38, name: "IX - A", gradeId: 12 },
      { id: 39, name: "IX - B", gradeId: 12 },
      { id: 40, name: "IX - C", gradeId: 12 },
      { id: 41, name: "X - A", gradeId: 13 },
      { id: 42, name: "X - B", gradeId: 13 },
      { id: 43, name: "X - C", gradeId: 13 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Classes seeded");

  console.log("✅ Seeding Subjects");

  const subjectsData = [
    { id: 1, name: "ENGLISH I" },
    { id: 2, name: "ENGLISH II" },
    { id: 3, name: "NUMBER WORK" },
    { id: 4, name: "SPELLINGS" },
    { id: 5, name: "RHYMES" },
    { id: 6, name: "ENVIRONMENTAL SCIENCE (EVS)" },
    { id: 7, name: "DRAWING" },
    { id: 8, name: "COMPUTER SCIENCE" },
    { id: 9, name: "TELUGU" },
    { id: 10, name: "HINDI" },
    { id: 11, name: "MATHEMATICS" },
    { id: 12, name: "GENERAL KNOWLEDGE (G.K.)" },
    { id: 13, name: "SPELLING & HANDWRITING" },
    { id: 14, name: "MORAL SCIENCE" },
    { id: 15, name: "READING & RECITATION" },
    { id: 16, name: "SOCIAL STUDIES" },
    { id: 17, name: "GENERAL SCIENCE" },
    { id: 18, name: "PHYSICS" },
    { id: 19, name: "CHEMISTRY" },
    { id: 20, name: "BIOLOGY" },
    { id: 21, name: "HISTORY & CIVICS" },
    { id: 22, name: "GEOGRAPHY" },
    { id: 23, name: "SECOND LANGUAGE (TELUGU/HINDI)" },
    { id: 24, name: "THIRD LANGUAGE (TELUGU/HINDI)" }
  ];

  await prisma.subject.createMany({ data: subjectsData, skipDuplicates: true });
  console.log("✅ Subjects seeded");


    console.log("📂 Reading CSV file...");

    const studentsFilePath = path.join(__dirname, "../NewFolder/students_cleaned.csv");

    // Check if CSV file exists
    if (!fs.existsSync(studentsFilePath)) {
      console.error(`❌ Error: CSV file not found at ${studentsFilePath}`);
      process.exit(1);
    }

    const students: any[] = [];

    // Function to parse DOB safely
    function parseDate(dateString: string | undefined): string | Date {
      if (!dateString || dateString.trim() === "" || dateString.toUpperCase() === "NA") {
        return "NA"; // ✅ Store as "NA" instead of null
      }

      // Check if the date follows DD-MM-YYYY format
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);

        // Validate parsed numbers
        if (isNaN(day) || isNaN(month) || isNaN(year) || day > 31 || month > 12 || year < 1900) {
          console.warn(`⚠️ Invalid date: ${dateString}, saving as "NA"`);
          return "NA";
        }

        return new Date(`${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`);
      }

      console.warn(`⚠️ Invalid format: ${dateString}, saving as "NA"`);
      return "NA";
    }

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(studentsFilePath)
        .pipe(csvParser())
        .on("data", (row) => {
          const dob = parseDate(row.dob);
    
          students.push({
            id: row.id,
            username: row.username,
            name: row.name,
            surname: row.surname,
            parentName: row.parentName,
            phone: row.phone,
            address: row.address,
            gender: row.gender,
            dob,
            classId: Number(row.classId),
          });
        })
        .on("end", async () => {
          console.log(`📊 Found ${students.length} students in CSV.`);
    
          // ✅ Sort students before inserting into PostgreSQL
          students.sort((a, b) => {
            if (a.classId !== b.classId) return a.classId - b.classId; // Sort by classId
            if (a.gender !== b.gender) return b.gender.localeCompare(a.gender); // Female first
            return a.name.localeCompare(b.name); // Sort by name (A-Z)
          });
    
          console.log("📌 Sorted student data:", students.slice(0, 5)); // ✅ Debugging
    
          if (students.length > 0) {
            await prisma.student.createMany({
              data: students,
              skipDuplicates: true,
            });
            console.log("🎉 Students seeded successfully!");
          } else {
            console.warn("⚠️ No valid students to insert!");
          }
          resolve();
        })
        .on("error", (error) => {
          console.error("❌ Error reading CSV:", error);
          reject(error);
        });
    });

  // ✅ Seed Teachers
  // await prisma.teacher.createMany({
  //   data: [
  //     {
  //       id: "T1",
  //       username: "teacher1",
  //       name: "Alice",
  //       surname: "Brown",
  //       email: "alice@example.com",
  //       phone: "9876541111",
  //       address: "100 Main St, City",
  //       img: null,
  //       bloodType: "A+",
  //       gender: "Female",
  //       createdAt: new Date(),
  //       deletedAt: null,
  //       supervisor: false,
  //       dob: new Date("1985-03-25"),
  //     },
  //     {
  //       id: "T2",
  //       username: "teacher2",
  //       name: "Robert",
  //       surname: "Williams",
  //       email: "robert@example.com",
  //       phone: "9876542222",
  //       address: "200 Elm St, City",
  //       img: null,
  //       bloodType: "O+",
  //       gender: "Male",
  //       createdAt: new Date(),
  //       deletedAt: null,
  //       supervisor: true,
  //       dob: new Date("1978-11-15"),
  //     },
  //   ],
  //   skipDuplicates: true,
  // });

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

  // Run the seed script using the following command:
// npx ts-node prisma/seed.ts
// This will seed the data from the CSV file to the database
// You can also run the seed script using the following command:
// npm run seed
// npx tsx prisma/seed.ts