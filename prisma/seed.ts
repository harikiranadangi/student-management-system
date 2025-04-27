import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create function to read CSV files
const readCSVFile = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

const prisma = new PrismaClient();

async function main() {
  

  console.log("📌 Seeding data...");

  const projectRootPath = path.resolve(__dirname, '..');  // Move one level up to the root
  const gradesFilePath = path.join(projectRootPath, 'data', 'grades.csv');
  const classesFilePath = path.join(projectRootPath, 'data', 'classes.csv');
  const subjectsFilePath = path.join(projectRootPath, 'data', 'subjects.csv'); // <- NEW
  const gradeSubjectsFilePath = path.join(projectRootPath, 'data', 'grade_subjects_data.csv');

  console.log(`Grades CSV Path: ${gradesFilePath}`);
  console.log(`Classes CSV Path: ${classesFilePath}`);
  console.log(`Subjects CSV Path: ${subjectsFilePath}`);
  console.log(`Grade Subjects CSV Path: ${gradeSubjectsFilePath}`);

  // 1. Seed Grades
  const gradesData = await readCSVFile(gradesFilePath);
  const formattedGrades = gradesData.map((row: any) => ({
    id: parseInt(row.id),
    level: row.level,
  }));

  await prisma.grade.createMany({ data: formattedGrades, skipDuplicates: true });
  console.log("✅ Grades seeded");

  // 2. Seed Classes
  const classesData = await readCSVFile(classesFilePath);
  const formattedClasses = classesData.map((row: any) => ({
    id: parseInt(row.id),
    name: row.name,
    gradeId: parseInt(row.gradeId),
    supervisorId: row.supervisorId,
  }));

  await prisma.class.createMany({ data: formattedClasses, skipDuplicates: true });
  console.log("✅ Classes with teachers seeded");

  // 3. Seed Subjects
  if (!fs.existsSync(subjectsFilePath)) {
    console.error(`File not found: ${subjectsFilePath}`);
    return;
  }

  const subjectsData = await readCSVFile(subjectsFilePath);
  
  const formattedSubjects = subjectsData.map((row: any) => ({
    name: row.name,  // Assuming CSV has column "name"
  }));

  await prisma.subject.createMany({ data: formattedSubjects, skipDuplicates: true });
  console.log("✅ Subjects seeded");

  // 4. Connect Subjects to Grades
  if (!fs.existsSync(gradeSubjectsFilePath)) {
    console.error(`File not found: ${gradeSubjectsFilePath}`);
    return;
  }

  const gradeSubjectsData = await readCSVFile(gradeSubjectsFilePath);

  for (const row of gradeSubjectsData) {
    const { gradeId, subject } = row;

    const subjectEntry = await prisma.subject.findUnique({
      where: { name: subject },
    });

    if (!subjectEntry) {
      console.error(`⚠️ Subject "${subject}" not found. Skipping connection...`);
      continue;
    }

    await prisma.subject.update({
      where: { id: subjectEntry.id },
      data: {
        grades: {
          connect: { id: parseInt(gradeId) },
        },
      },
    });
  }

  console.log("✅ Subjects connected to grades");

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
