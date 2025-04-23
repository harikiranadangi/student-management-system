import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Ensure prisma is correctly imported
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  try {
    const paramId = req.nextUrl.pathname.split("/")[4]; // Get the student ID
    const data = await req.json();

    if (!data.id || data.id !== paramId) {
      return NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 }
      );
    }

    // Initialize Clerk client
    const client = await clerkClient();

    // Check if the Clerk user exists
    let userExists;
    try {
      userExists = await client.users.getUser(data.id);
      if (!userExists) {
        return NextResponse.json({ message: 'User not found in Clerk' }, { status: 404 });
      }
    } catch (err) {
      console.error("Error checking Clerk user:", err);
      return NextResponse.json({ message: 'Clerk user not found' }, { status: 404 });
    }

    // Update the user in Clerk (only if password is provided)
    if (data.password) {
      await client.users.updateUser(data.id, {
        username: data.username,
        password: data.password, // Only update password if provided
        firstName: data.name,
        lastName: data.surname,
      });
    }

    // Update student in Prisma (without the password)
    const existingStudent = await prisma.student.findUnique({
      where: { id: data.id },
    });

    const updatedStudent = await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        dob: data.dob || existingStudent?.dob,
        email: data.email || null,
        phone: data.phone!,
        address: data.address!,
        gender: data.gender,
        img: data.img || null,
        bloodType: data.bloodType || null,
        classId: data.classId,
      },
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
