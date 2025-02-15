import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("🚀 Resetting database...");

    // Step 1: Delete dependent records first
    await prisma.attendance.deleteMany();
    await prisma.result.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.event.deleteMany();
    await prisma.announcement.deleteMany();

    // Step 2: Delete main entities
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.class.deleteMany();
    await prisma.grade.deleteMany();
    await prisma.subject.deleteMany();
    
    
    console.log("✅ Database reset successful!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
resetDatabase();
