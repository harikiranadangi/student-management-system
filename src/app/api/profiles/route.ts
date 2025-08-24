import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const clerkUserId = user.id;

  // Fetch all userProfiles for this Clerk ID
  const profiles = await prisma.userProfile.findMany({
    where: { clerk_id: clerkUserId },
    include: {
      Teacher: true,
      Student: true,
      Admin: true,
    },
  });

  // Normalize the structure for frontend
  const formattedProfiles = profiles.flatMap((p) => {
    const result: any[] = [];
    if (p.Student) {
      result.push({ id: p.Student.id, role: "student", name: p.Student.name });
    }
    if (p.Teacher) {
      result.push({ id: p.Teacher.id, role: "teacher", name: p.Teacher.name });
    }
    if (p.Admin) {
      result.push({ id: p.Admin.id, role: "admin", name: p.Admin.name });
    }
    return result;
  });

  return NextResponse.json(formattedProfiles);
}
