// route.ts
import { adminSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST: Create new admin
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = adminSchema.parse(body);

    const admin = await prisma.admin.create({
      data: {
        username: data.username,
        full_name: data.full_name,
        password: data.password,
        parentName: data.parentName ?? null,
        gender: data.gender,
        email: data.email ?? null,
        address: data.address,
        bloodType: data.bloodType ?? null,
        dob: data.dob ?? null,
        img: data.img ?? null,
        phone: data.phone,
      },
    });

    return NextResponse.json({ success: true, admin }, { status: 201 });
  } catch (error: any) {
    console.error("Admin creation error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

// GET: List all admins
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(admins, { status: 200 });
  } catch (error: any) {
    console.error("Admin fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
