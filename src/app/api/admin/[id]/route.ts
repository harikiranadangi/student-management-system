import { NextRequest, NextResponse } from "next/server";
import { adminSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";

// Update admin
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params; // ✅ Await here
    const adminId = parseInt(id);
    const body = await req.json();

    const data = adminSchema.parse({
      ...body,
      id: adminId,
    });

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId},
      data,
    });

    return NextResponse.json({ success: true, updatedAdmin }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/admin/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete admin
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ Await here
    const adminId = parseInt(id);
    const deletedAdmin = await prisma.admin.delete({
      where: { id: adminId },
    });

    return NextResponse.json({ success: true, deletedAdmin }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/admin/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
