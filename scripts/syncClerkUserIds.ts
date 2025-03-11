import * as dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const CLERK_API_URL = "https://api.clerk.dev/v1";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Fetch all students from the database
async function fetchStudentsFromDB() {
  try {
    const students = await prisma.clerkUser.findMany({
      where: { role: "student" }, // Only students
    });
    console.log(`📢 Found ${students.length} students in DB.`);
    return students;
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return [];
  }
}

// Fetch all Clerk users
async function fetchClerkUsers() {
  let users: any[] = [];
  let offset = 0; // Start from the first user
  const limit = 50; // Fetch 100 users per request (max Clerk limit)

  try {
    while (true) {
      console.log(`📤 Fetching Clerk users - Offset ${offset}...`);

      const response = await axios.get(`${CLERK_API_URL}/users`, {
        headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
        params: { limit, offset },
      });

      const data = response.data;
      if (!data || data.length === 0) break; // Stop if no more users

      users = [...users, ...data];
      offset += limit; // Move to the next batch
    }

    console.log(`✅ Total Clerk users fetched: ${users.length}`);
    return users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error fetching Clerk users:", error.response?.data || error.message);
    } else {
      console.error("❌ Error fetching Clerk users:", error);
    }
    return [];
  }
}


// Sync Clerk user IDs with database
async function syncClerkUserIds() {
  const students = await fetchStudentsFromDB();
  const clerkUsers = await fetchClerkUsers();

  if (students.length === 0 || clerkUsers.length === 0) {
    console.log("❌ No data found to sync.");
    return;
  }

  // Create a mapping: username -> user_id
  const clerkUserMap: Record<string, string> = {};
  for (const clerkUser of clerkUsers) {
    if (clerkUser.username) {
      clerkUserMap[clerkUser.username] = clerkUser.id;
    }
  }

  // Update students in the database
  for (const student of students) {
    const clerkId = clerkUserMap[student.username] || null;

    // Update user_id column in the database
    await prisma.clerkUser.updateMany({
      where: { username: student.username },
      data: { user_id: clerkId },
    });

    console.log(
      clerkId
        ? `✅ Synced user_id for ${student.username}: ${clerkId}`
        : `⚠️ No Clerk user found for ${student.username}, setting user_id to NULL`
    );
  }

  console.log("🎉 User ID sync completed!");
  console.log("Total students updated:", students.length);
}

// Run the sync process
syncClerkUserIds();

// * npx tsx scripts/syncClerkUserIds.ts