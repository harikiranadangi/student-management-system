// src/app/api/users/students/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { studentschema } from "@/lib/formValidationSchemas";
import { revalidatePath } from "next/cache";

const client = await clerkClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 keep as you asked
) {
  try {
    const { id } = await params; // since it's a Promise in your code
    const studentId = id;
    const body = await req.json();

    // ✅ Validate with Zod
    const parsed = studentschema.safeParse({ ...body, id: studentId });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 🔍 Find existing student
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
      include: { linkedUser: true },
    });

    if (!existingStudent || !existingStudent.clerk_id) {
      return NextResponse.json(
        { success: false, error: "Student or associated Clerk user not found" },
        { status: 404 }
      );
    }

    const user = await client.users.getUser(existingStudent.clerk_id);
    const formattedPhone = `+91${data.phone}`;
    const updatedUsername = `s${studentId}`;

    // 🔑 Check if phone already exists
    const phoneAlreadyAdded = user.phoneNumbers.find(
      (ph) => ph.phoneNumber === formattedPhone
    );

    if (!phoneAlreadyAdded) {
      // Add new phone
      const newPhone = await client.phoneNumbers.createPhoneNumber({
        userId: existingStudent.clerk_id,
        phoneNumber: formattedPhone,
      });

      await client.phoneNumbers.updatePhoneNumber(newPhone.id, {
        verified: true,
      });

      // Set as primary
      await client.users.updateUser(existingStudent.clerk_id, {
        primaryPhoneNumberID: newPhone.id,
      });

      // Remove old phones
      for (const ph of user.phoneNumbers) {
        if (ph.phoneNumber !== formattedPhone) {
          await client.phoneNumbers.deletePhoneNumber(ph.id);
        }
      }
    }

    // ✅ Update Clerk user basic info
    await client.users.updateUser(existingStudent.clerk_id, {
      firstName: data.name,
    });

    // ✅ Update Student in Prisma
    const { dob, classId, gradeId, ...otherData } = data;

    const studentData: any = {
      ...otherData,
      ...(dob ? { dob: new Date(dob) } : {}),

      // ✅ Only connect class
      ...(classId ? { Class: { connect: { id: Number(classId) } } } : {}),
    };

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: studentData,
      include: {
        Class: {
          include: {
            Grade: true, // fetch grade too if needed
          },
        },
      },
    });


    // ✅ Sync LinkedUser + Profile
    if (existingStudent.linkedUser) {
      await prisma.linkedUser.update({
        where: { id: existingStudent.linkedUser.id },
        data: {
          username: updatedUsername,
          profile: {
            update: {
              phone: data.phone,
            },
          },
        },
      });
    }

    revalidatePath("/list/users/students");

    return NextResponse.json({ success: true, updatedStudent }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/users/students/[id] error:", error);
    if (error.errors) console.error("Clerk error details:", error.errors);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.name === "ZodError" ? 400 : 500 }
    );
  }
}


// PATCH - Update student status (Active, Inactive, Transferred, Suspended)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = id;
    const { status } = await req.json();

    if (!["ACTIVE", "INACTIVE", "TRANSFERRED", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    console.log("Sending status update:", status);


    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { status },
    });

    revalidatePath("/list/users/students");

    return NextResponse.json({ success: true, updatedStudent }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Status update failed" },
      { status: 500 }
    );
  }
}



// DELETE - Delete student
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = id;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "No valid ID provided" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.clerk_id) {
      await client.users.deleteUser(student.clerk_id);
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    revalidatePath("/list/users/students");

    return NextResponse.json(
      { success: true, message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/users/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}