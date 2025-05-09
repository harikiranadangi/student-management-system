import { NextRequest, NextResponse } from "next/server";
import { adminSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

const client = await clerkClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminId = parseInt(id);
    const body = await req.json();


    const data = adminSchema.parse({
      ...body,
      id: adminId,
    });

    // Get existing admin to fetch Clerk ID
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin || !existingAdmin.clerkId) {
      return NextResponse.json(
        { success: false, error: "Admin or associated Clerk user not found" },
        { status: 404 }
      );
    }


    // Update Clerk user
    await client.users.updateUser(existingAdmin.clerkId, {
      firstName: data.full_name,
      username: data.username, // If using usernames
      password: data.password, // If using passwords
    });

    // Update admin in your database
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data,
    });

    console.log("Updated admin:", updatedAdmin);

    return NextResponse.json({ success: true, updatedAdmin }, { status: 200 });

  } catch (error: any) {
    console.error("PUT /api/admin/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminId = parseInt(id);

    // Fetch admin to get clerkId
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    // Delete Clerk user
    if (admin.clerkId) {
      await client.users.deleteUser(admin.clerkId);
    }

    // Delete admin from Prisma
    const deletedAdmin = await prisma.admin.delete({
      where: { id: adminId },
    });

    return NextResponse.json({ success: true, deletedAdmin }, { status: 200 });

  } catch (error: any) {
    console.error("DELETE /api/admin/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
