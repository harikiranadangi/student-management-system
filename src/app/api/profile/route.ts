import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // ✅ Step 1: Get authenticated Clerk user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Step 2: Fetch profile + roles
    const profile = await prisma.profile.findUnique({
      where: { clerk_id: userId },
      include: { users: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // ✅ Step 3: Return clean response
    return NextResponse.json({
      id: profile.id,
      phone: profile.phone,
      clerk_id: profile.clerk_id,
      activeRoleId: profile.activeUserId,
      roles: profile.users.map((r) => ({
        id: r.id,
        role: r.role,
        username: r.username,
        profileId: r.profileId,
      })),
    });
  } catch (error) {
    console.error("API /profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
