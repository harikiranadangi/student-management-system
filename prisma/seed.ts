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
  await prisma.grade.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  // await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();

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
      { id: 1, name: "Pre KG", gradeId: 1, supervisorId: "staff_ks_063" },
      { id: 2, name: "LKG - A", gradeId: 2, supervisorId: "staff_ks_001" },
      { id: 3, name: "LKG - B", gradeId: 2, supervisorId: "staff_ks_002" },
      { id: 4, name: "UKG - A", gradeId: 3, supervisorId: "staff_ks_003" },
      { id: 5, name: "UKG - B", gradeId: 3, supervisorId: "staff_ks_004" },
      { id: 6, name: "UKG - C", gradeId: 3, supervisorId: "staff_ks_005" },
      { id: 7, name: "I - A", gradeId: 4, supervisorId: "staff_ks_007" },
      { id: 8, name: "I - B", gradeId: 4, supervisorId: "staff_ks_008" },
      { id: 9, name: "I - C", gradeId: 4, supervisorId: "staff_ks_009" },
      { id: 10, name: "I - D", gradeId: 4, supervisorId: "staff_ks_012" },
      { id: 11, name: "II - A", gradeId: 5, supervisorId: "staff_ks_015" },
      { id: 12, name: "II - B", gradeId: 5, supervisorId: "staff_ks_016" },
      { id: 13, name: "II - C", gradeId: 5, supervisorId: "staff_ks_017" },
      { id: 14, name: "II - D", gradeId: 5, supervisorId: "staff_ks_018" },
      { id: 15, name: "III - A", gradeId: 6, supervisorId: "staff_ks_019" },
      { id: 16, name: "III - B", gradeId: 6, supervisorId: "staff_ks_020" },
      { id: 17, name: "III - C", gradeId: 6, supervisorId: "staff_ks_022" },
      { id: 18, name: "III - D", gradeId: 6, supervisorId: "staff_ks_025" },
      { id: 19, name: "IV - A", gradeId: 7, supervisorId: "staff_ks_028" },
      { id: 20, name: "IV - B", gradeId: 7, supervisorId: "staff_ks_029" },
      { id: 21, name: "IV - C", gradeId: 7, supervisorId: "staff_ks_030" },
      { id: 22, name: "IV - D", gradeId: 7, supervisorId: "staff_ks_032" },
      { id: 23, name: "V - A", gradeId: 8, supervisorId: "staff_ks_033" },
      { id: 24, name: "V - B", gradeId: 8, supervisorId: "staff_ks_034" },
      { id: 25, name: "V - C", gradeId: 8, supervisorId: "staff_ks_036" },
      { id: 26, name: "V - D", gradeId: 8, supervisorId: "staff_ks_037" },
      { id: 27, name: "VI - A", gradeId: 9, supervisorId: "staff_ks_038" },
      { id: 28, name: "VI - B", gradeId: 9, supervisorId: "staff_ks_039" },
      { id: 29, name: "VI - C", gradeId: 9, supervisorId: "staff_ks_040" },
      { id: 30, name: "VI - D", gradeId: 9, supervisorId: "staff_ks_041" },
      { id: 31, name: "VII - A", gradeId: 10, supervisorId: "staff_ks_043" },
      { id: 32, name: "VII - B", gradeId: 10, supervisorId: "staff_ks_044" },
      { id: 33, name: "VII - C", gradeId: 10, supervisorId: "staff_ks_045" },
      { id: 34, name: "VII - D", gradeId: 10, supervisorId: "staff_ks_046" },
      { id: 35, name: "VIII - A", gradeId: 11, supervisorId: "staff_ks_048" },
      { id: 36, name: "VIII - B", gradeId: 11, supervisorId: "staff_ks_050" },
      { id: 37, name: "VIII - C", gradeId: 11, supervisorId: "staff_ks_052" },
      { id: 38, name: "IX - A", gradeId: 12, supervisorId: "staff_ks_054" },
      { id: 39, name: "IX - B", gradeId: 12, supervisorId: "staff_ks_055" },
      { id: 40, name: "IX - C", gradeId: 12, supervisorId: "staff_ks_056" },
      { id: 41, name: "X - A", gradeId: 13, supervisorId: "staff_ks_057" },
      { id: 42, name: "X - B", gradeId: 13, supervisorId: "staff_ks_061" },
      { id: 43, name: "X - C", gradeId: 13, supervisorId: "staff_ks_062" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Classes with teachers seeded");


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

  const studentsFilePath = path.join(__dirname, "../data/student_data.csv");

  // Check if CSV file exists
  if (!fs.existsSync(studentsFilePath)) {
    console.error(`❌ Error: CSV file not found at ${studentsFilePath}`);
    process.exit(1);
  }

  const students: any[] = [];

  function parseDate(dateString: string | undefined): string | Date {
    if (!dateString || dateString.trim() === "" || dateString.toUpperCase() === "NA") {
      return "NA"; // ✅ Store as "NA" instead of null
    }

    dateString = dateString.trim(); // ✅ Remove spaces

    // Check if it's in YYYY-MM-DD format (which is valid)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString);
    }

    // Check if the date follows DD-MM-YYYY format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      let [day, month, year] = parts.map(Number);

      // Handle cases where the year is first
      if (year < 1000) {
        [year, month, day] = [day, month, year]; // Swap if wrongly parsed
      }

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
        console.log(`🔍 Parsing row:`, row); // ✅ Debug each row
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
          email: row.email,
          bloodType: row.bloodType,
          dob,
          classId: Number(row.classId),
          clerk_id: row.clerk_id,
        });
      })
      .on("end", async () => {
        console.log(`📊 Found ${students.length} students in CSV.`);

        console.log("📌 Sorted student data:", students.slice(0, 5)); // ✅ Debugging

        students.forEach((student, index) => {
          if (!("dob" in student)) {
            console.warn(`🚨 Missing 'dob' field in record at index ${index}:`, student);
          }
        });

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

  console.log("🌱 Seeding complete!");
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