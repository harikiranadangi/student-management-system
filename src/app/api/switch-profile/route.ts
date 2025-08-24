import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { role } = body;
    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    console.log("Switch profile request:", { userId: user.id, role });

    // Find profile linked to logged-in Clerk user
    const profile = await prisma.profile.findUnique({
      where: { clerk_id: user.id },
      include: { roles: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "No profile found for this user" }, { status: 404 });
    }

    // Check if the profile has the requested role
    const hasRole = profile.roles.some((r) => r.role === role);
    if (!hasRole) {
      return NextResponse.json(
        { error: `Profile does not have role: ${role}` },
        { status: 403 }
      );
    }

    // Return profile info with selected role
    return NextResponse.json({
      message: "Switched role successfully",
      profile: {
        id: profile.id,
        phone: profile.phone,
        clerk_id: profile.clerk_id,
        activeRole: role,
      },
    });
  } catch (error) {
    console.error("Switch profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
