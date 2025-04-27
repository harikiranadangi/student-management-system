// prisma/reset.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🧹 Resetting database...");

  try {
    // Deleting child tables first to avoid foreign key constraint errors
    // await prisma.studentTotalFees.deleteMany();
    // await prisma.studentFees.deleteMany();
    // await prisma.feeStructure.deleteMany();
    // await prisma.class.deleteMany();
    // await prisma.teacher.deleteMany();
    await prisma.subject.deleteMany();
    // await prisma.grade.deleteMany();
    // await prisma.student.deleteMany(); // students last (if they exist)

    console.log("✅ Database reset complete!");
  } catch (error) {
    console.error("❌ Reset failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();


// * npx tsx prisma/reset.ts