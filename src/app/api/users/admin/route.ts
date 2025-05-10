import { adminSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = adminSchema.parse(body);

    const client = await clerkClient();

    // Check if Clerk user with username already exists
    const existingUsers = await client.users.getUserList({ query: data.username });
    if (existingUsers.totalCount > 0) {
      return NextResponse.json(
        { message: `Username "${data.username}" already exists!` },
        { status: 409 }
      );
    }

    // Create Clerk user with phone number (using array format)
    const clerkUser = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.full_name,
      phoneNumber: [`+91${data.phone}`],  // Passing phone as an array
    });

    // Optionally add metadata, including role
    await client.users.updateUser(clerkUser.id, {
      publicMetadata: {
        role: "admin",  // You can dynamically set the role if needed
      },
    });

    // Create admin in Prisma DB
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
        clerkId: clerkUser.id,
      },
    });

    return NextResponse.json({ success: true, admin }, { status: 201 });

  } catch (error: any) {
    console.error("Admin creation error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Log more detailed Clerk error message
    if (error.errors && Array.isArray(error.errors)) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }


    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
