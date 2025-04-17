import { NextRequest, NextResponse } from "next/server";
import { adminSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";

// Update admin
export async function PUT(req: NextRequest) {
  // Extract the ID from the URL directly
  const paramId = req.nextUrl.pathname.split("/")[3];  // Assuming `/api/admin/[id]`

  try {
    const body = await req.json();

    const data = adminSchema.parse({
      ...body,
      id: Number(paramId),
    });

    const updatedAdmin = await prisma.admin.update({
      where: { id: Number(paramId) },
      data,
    });

    return NextResponse.json({ success: true, updatedAdmin }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/admin/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete admin
export async function DELETE(req: NextRequest) {
    // Extract the ID from the URL directly
  const paramId = req.nextUrl.pathname.split("/")[3];  // Assuming `/api/admin/[id]`
    try {
      const deletedAdmin = await prisma.admin.delete({
        where: { id: Number(paramId) },
      });
  
      return NextResponse.json({ success: true, deletedAdmin }, { status: 200 });
    } catch (error: any) {
      console.error("DELETE /api/admin/[id] error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  
