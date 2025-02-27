import { PrismaClient } from '@prisma/client';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

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
    skipDuplicates: true, // Prevents errors if data already exists
  });

  console.log('✅ Grades seeded');

  // Insert Class Data (starting from id = 1)
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

  console.log('✅ Classes seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
