import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// PUT - Update student data
export async function PUT(req: NextRequest) {
  try {
    const paramId = req.nextUrl.pathname.split("/")[4]; // Extract ID from the URL
    const data = await req.json();

    // Validate the request data and the URL ID
    if (!data.id || data.id !== paramId) {
      return NextResponse.json(
        { message: "Invalid or mismatched student ID" },
        { status: 400 }
      );
    }

    // Get Clerk client
    const client = await clerkClient();

    // Fetch the linked Clerk user ID from clerkStudents table
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

    // Fetch the existing student to retain fallback fields
    const existingStudent = await prisma.student.findUnique({
      where: { id: data.id },
    });

    if (!existingStudent) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Update the student in Prisma
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

// DELETE - Delete a student
export async function DELETE(req: NextRequest) {
  try {
    // Extract student ID from the URL path
    const paramId = req.nextUrl.pathname.split("/")[4]; // Extract ID from URL
    if (!paramId) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    // Fetch the student to get the Clerk user ID
    const student = await prisma.student.findUnique({
      where: { id: paramId },
      select: { clerk_id: true },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Initialize Clerk client
    const client = await clerkClient();

    // Delete the user from Clerk if clerk_id exists
    if (student.clerk_id) {
      try {
        await client.users.deleteUser(student.clerk_id);
      } catch (err) {
        console.error("Clerk user deletion error:", err);
        return NextResponse.json({ message: "Error deleting user from Clerk" }, { status: 500 });
      }
    }

    // Delete the student from Prisma
    await prisma.student.delete({
      where: { id: paramId },
    });

    console.log(`Student with ID ${paramId} and Clerk ID ${student.clerk_id} deleted successfully`);

    // Optional: Trigger revalidation to refresh student list
    revalidatePath("/list/users/students");

    return NextResponse.json({ success: true, message: "Student deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting student:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
