import * as dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const CLERK_API_URL = "https://api.clerk.dev/v1";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

async function fetchStudentsFromDB() {
  try {
    const students = await prisma.clerk_users.findMany({
      where: { role: "student" }, // Fetch only students
    });
    console.log(`📢 Found ${students.length} students to sync.`);
    return students;
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return [];
  }
}

async function createClerkUser(user: any) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Prevent rate limits

    const response = await axios.post(
      `${CLERK_API_URL}/users`,
      {
        username: user.username,
        email_addresses: [`${user.username}@example.com`], // Change this if needed
        password: user.password,
        full_name: user.name,
        public_metadata: { role: "student" }, // Assign role in Clerk
      },
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Created Clerk user: ${user.username} (ID: ${response.data.id})`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Failed to create user ${user.username}:`, error.response?.data || error.message);
    } else {
      console.error(`❌ Failed to create user ${user.username}:`, error);
    }
  }
}

async function syncUsersToClerk() {
  const students = await fetchStudentsFromDB();
  
  if (students.length === 0) {
    console.log("❌ No students found to sync.");
    return;
  }

  for (const student of students) {
    await createClerkUser(student);
  }

  console.log("🎉 Bulk user sync completed!");
}

// Run the sync process
syncUsersToClerk();

//npx tsx scripts/syncClerkUsers.ts
