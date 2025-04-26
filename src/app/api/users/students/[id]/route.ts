import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  try {
    const paramId = req.nextUrl.pathname.split("/")[4];
    const data = await req.json();

    if (!data.id || data.id !== paramId) {
      return NextResponse.json(
        { message: "Invalid or mismatched student ID" },
        { status: 400 }
      );
    }

    // Get Clerk client
    const client = await clerkClient();

    // Get the linked Clerk user ID from the clerkStudents table
    const clerkStudent = await prisma.clerkStudents.findUnique({
      where: { studentId: data.id },
    });

    if (!clerkStudent || !clerkStudent.user_id) {
      return NextResponse.json(
        { message: "Linked Clerk user not found for student." },
        { status: 404 }
      );
    }

    // Try fetching the user from Clerk
    let clerkUser;
    try {
      clerkUser = await client.users.getUser(clerkStudent.user_id);
    } catch (err) {
      console.error("Clerk user fetch error:", err);
      return NextResponse.json({ message: "Clerk user not found" }, { status: 404 });
    }

    // Update Clerk user if necessary
    if (data.password || data.username || data.name || data.surname) {
      await client.users.updateUser(clerkStudent.user_id, {
        username: data.username,
        password: data.password || undefined,
        firstName: data.name,
        lastName: data.surname,
      });
    }

    // Fetch existing student to retain fallback fields
    const existingStudent = await prisma.student.findUnique({
      where: { id: data.id },
    });

    if (!existingStudent) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Update student in Prisma
    const updatedStudent = await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        dob: data.dob || existingStudent.dob,
        email: data.email || null,
        phone: data.phone!,
        address: data.address!,
        gender: data.gender,
        img: data.img ?? existingStudent.img ?? null,
        bloodType: data.bloodType ?? existingStudent.bloodType ?? null,
        classId: data.classId,
      },
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
