// src/app/api/users/students/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { studentschema } from "@/lib/formValidationSchemas";

const client = await clerkClient();

// PUT - Update student
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = id;
    const body = await req.json();

    const data = studentschema.parse({
      ...body,
      id: studentId,
    });

    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        Class: {
          select: {
            gradeId: true,
          },
        },
      },
    });

    if (!existingStudent || !existingStudent.clerk_id) {
      return NextResponse.json(
        { success: false, error: "Student or associated Clerk user not found" },
        { status: 404 }
      );
    }

    const user = await client.users.getUser(existingStudent.clerk_id);
    const formattedNewPhone = `+91${data.phone}`;

    const existingPhone = user.phoneNumbers.find(
      (phone) => phone.phoneNumber === formattedNewPhone
    );

    const updatedUsername = `s${data.id}`;
    const isPrimary =
      existingPhone && existingPhone.id === user.primaryPhoneNumberId;

    if (existingPhone && isPrimary) {
      await client.users.updateUser(existingStudent.clerk_id, {
        firstName: data.name,
        username: updatedUsername,
        password: data.phone,
      });
    } else if (existingPhone && !isPrimary) {
      return NextResponse.json(
        { success: false, error: "Phone number already associated with this user" },
        { status: 422 }
      );
    } else {
      const newPhone = await client.phoneNumbers.createPhoneNumber({
        userId: existingStudent.clerk_id,
        phoneNumber: formattedNewPhone,
      });

      await client.phoneNumbers.updatePhoneNumber(newPhone.id, {
        verified: true,
      });

      await client.users.updateUser(existingStudent.clerk_id, {
        primaryPhoneNumberID: newPhone.id,
      });

      const oldPhones = user.phoneNumbers.filter(
        (phone) => phone.id !== newPhone.id
      );

      for (const oldPhone of oldPhones) {
        await client.phoneNumbers.deletePhoneNumber(oldPhone.id);
      }

      await client.users.updateUser(existingStudent.clerk_id, {
        firstName: data.name,
        username: updatedUsername,
        password: updatedUsername,
      });
    }

    const { gradeId, dob, ...otherData } = data;

    const studentData: any = {
      ...otherData,
    };

    // ✅ Safely parse dob
    if (dob) {
      studentData.dob = new Date(dob);
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: studentData,
    });

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