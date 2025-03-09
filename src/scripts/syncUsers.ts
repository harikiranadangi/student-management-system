import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server"; // ✅ Correct import for Next.js Clerk
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function syncStudentsWithClerk() {
    try {
        // 1️⃣ Fetch students from PostgreSQL
        const students = await prisma.clerk_users.findMany(); // ✅ Match your Prisma model
        console.log(`Fetched ${students.length} students from DB`);

        const clerk = await clerkClient(); // ✅ Get the ClerkClient instance

        for (const student of students) {
            try {
                // 2️⃣ Check if student exists in Clerk
                const existingUsers = await clerk.users.getUserList({
                    emailAddress: [student.username], // Assuming username is the email
                });

                if (existingUsers.data.length > 0) {
                    console.log(`User already exists: ${student.username}`);
                    continue; // Skip existing users
                }

                // 3️⃣ Create user in Clerk
                const newUser = await clerk.users.createUser({
                    firstName: student.name,
                    lastName: student.surname,
                    emailAddress: [student.username], // Assuming username is email
                    password: student.password, // Use the stored password
                    publicMetadata: { studentId: student.id }, // Store Student ID for reference
                });

                console.log(`Created user in Clerk: ${newUser.id} (${student.username})`);
            } catch (err) {
                console.error(`Error processing student ${student.username}:`, err);
            }
        }
    } catch (error) {
        console.error("Error syncing students:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run sync function
syncStudentsWithClerk();
