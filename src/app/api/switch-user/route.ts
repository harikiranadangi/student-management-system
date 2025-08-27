import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    // ✅ Ensure the userId belongs to this profile
    const profile = await prisma.profile.findUnique({
      where: { clerk_id: user.id },
      include: { users: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const match = profile.users.find((u) => u.id === userId);
    if (!match) {
      return NextResponse.json({ error: "User not linked to this profile" }, { status: 403 });
    }

    // ✅ Update active user
    await prisma.profile.update({
      where: { id: profile.id },
      data: { activeUserId: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Switch user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
