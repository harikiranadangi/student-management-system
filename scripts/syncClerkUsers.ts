import * as dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const CLERK_API_URL = "https://api.clerk.dev/v1";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

async function fetchStudentsFromDB() {
  try {
    const students = await prisma.clerkUser.findMany({
      where: { role: "student" }, // Fetch only students
      take: 50, // Limit to 50 students for testing
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
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased delay to 1s

    // Extract first and last names
    const nameParts = user.full_name.split(" ");
    const firstName = nameParts[0]; // First word as first name
    const lastName = nameParts.slice(1).join(" ") || ""; // Remaining as last name

    console.log(`📤 Sending to Clerk:`, {
      username: user.username,
      email: `${user.username}@ksk.com`, // Ensure unique email
      first_name: firstName,
      last_name: lastName,
      full_name: user.full_name,
    });

    const response = await axios.post(
      `${CLERK_API_URL}/users`,
      {
        username: user.username,
        email_addresses: [`${user.username}@example.com`], // Ensure email format
        password: user.password,
        first_name: firstName, // Set first name
        last_name: lastName, // Set last name
        full_name: user.full_name, // Ensure full_name is stored
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
    console.log(`🔍 Syncing student:`, student);
    await createClerkUser(student);
  }

  console.log("🎉 Bulk user sync completed!");
}

// Run the sync process
syncUsersToClerk();

// Run the script with: npx tsx scripts/syncClerkUsers.ts
