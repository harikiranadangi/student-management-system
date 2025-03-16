import * as dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const CLERK_API_URL = "https://api.clerk.dev/v1";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Fetch students from the database
async function fetchStudentsFromDB() {
  try {
    const students = await prisma.clerkStudents.findMany({
      where: { role: "student" },
      take:56
    });
    console.log(`📢 Found ${students.length} students in DB.`);
    return students;
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return [];
  }
}

// Fetch teachers from the database
async function fetchTeachersFromDB() {
  try {
    const teachers = await prisma.clerkTeachers.findMany({
      where: { role: "teacher" },
      take:43
    });
    console.log(`📢 Found ${teachers.length} teachers in DB.`);
    return teachers;
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    return [];
  }
}

// Fetch all Clerk users
async function fetchClerkUsers() {
  let users: any[] = [];
  let offset = 0;
  const limit = 50;

  try {
    while (true) {
      console.log(`📤 Fetching Clerk users - Offset ${offset}...`);

      const response = await axios.get(`${CLERK_API_URL}/users`, {
        headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
        params: { limit, offset },
      });

      const data = response.data;
      if (!data || data.length === 0) break;

      users = [...users, ...data];
      offset += limit;
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

// Create user in Clerk
async function createClerkUser(user: any) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const nameParts = user.full_name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    console.log(`📤 Sending to Clerk:`, {
      username: user.username,
      email: `${user.username}@kotakschool.com`,
      first_name: firstName,
      last_name: lastName,
      full_name: user.full_name,
    });

    const response = await axios.post(
      `${CLERK_API_URL}/users`,
      {
        username: user.username,
        email_addresses: [`${user.username}@kotakschool.com`],
        password: user.password,
        first_name: firstName,
        last_name: lastName,
        full_name: user.full_name,
        public_metadata: { role: user.role },
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

// Sync Clerk user IDs with the database
async function syncClerkUserIds() {
  const teachers = await fetchTeachersFromDB();
  const students = await fetchStudentsFromDB();
  const clerkUsers = await fetchClerkUsers();

  if (students.length === 0 && teachers.length === 0) {
    console.log("❌ No data found to sync.");
    return;
  }

  const clerkUserMap: Record<string, string> = {};
  for (const clerkUser of clerkUsers) {
    if (clerkUser.username) {
      clerkUserMap[clerkUser.username] = clerkUser.id;
    }
  }

  for (const student of students) {
    const clerkId = clerkUserMap[student.username] || null;

    await prisma.clerkStudents.updateMany({
      where: { username: student.username },
      data: { user_id: clerkId },
    });

    console.log(
      clerkId
        ? `✅ Synced user_id for ${student.username}: ${clerkId}`
        : `⚠️ No Clerk user found for ${student.username}, setting user_id to NULL`
    );
  }

  for (const teacher of teachers) {
    const clerkId = clerkUserMap[teacher.username] || null;

    await prisma.clerkTeachers.updateMany({
      where: { username: teacher.username },
      data: { user_id: clerkId },
    });

    console.log(
      clerkId
        ? `✅ Synced user_id for ${teacher.username}: ${clerkId}`
        : `⚠️ No Clerk user found for ${teacher.username}, setting user_id to NULL`
    );
  }

  console.log("🎉 User ID sync completed!");
}

// Sync users to Clerk and update user_id
async function syncUsersToClerk() {
  const students = await fetchStudentsFromDB();
  const teachers = await fetchTeachersFromDB();

  if (students.length === 0 && teachers.length === 0) {
    console.log("❌ No students or teachers found to sync.");
    return;
  }

  for (const student of students) {
    await createClerkUser(student);
  }

  for (const teacher of teachers) {
    await createClerkUser(teacher);
  }

  await syncClerkUserIds();
  console.log("🎉 Bulk user sync completed!");
}

// Run the sync process
syncUsersToClerk();


// * npx tsx scripts/syncUsersToClerk.ts