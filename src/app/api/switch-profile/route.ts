// src/app/api/switch-role/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roleId } = await req.json();

    // 🔍 Find role in DB
    const roleEntry = await prisma.role.findUnique({
      where: { id: roleId },
      include: { profile: true },
    });
    if (!roleEntry || roleEntry.profile.clerk_id !== userId) {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    const client = await clerkClient();
    // 🟢 Update Clerk metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: roleEntry.role },
    });

    // 🟢 Save active role in DB
    await prisma.profile.update({
      where: { clerk_id: userId },
      data: { activeRoleId: roleId },
    });

    return NextResponse.json({ success: true, role: roleEntry.role });
  } catch (err) {
    console.error("Switch role error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
