import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { teacherschema } from "@/lib/formValidationSchemas";
import { revalidatePath } from "next/cache";

const client = await clerkClient();

// PUT - Update teacher
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacherId = id;
    const body = await req.json();

    const data = teacherschema.parse({ ...body, id: teacherId });

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }

    const user = await client.users.getUser(teacherId);
    const formattedNewPhone = `+91${data.phone}`;
    const existingPhone = user.phoneNumbers.find(
      (p) => p.phoneNumber === formattedNewPhone
    );

    const updatedUsername = data.username || `t${teacherId}`;
    const isPrimary = existingPhone?.id === user.primaryPhoneNumberId;

    if (existingPhone && isPrimary) {
      await client.users.updateUser(teacherId, {
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
        userId: teacherId,
        phoneNumber: formattedNewPhone,
      });

      await client.phoneNumbers.updatePhoneNumber(newPhone.id, {
        verified: true,
      });

      await client.users.updateUser(teacherId, {
        primaryPhoneNumberID: newPhone.id,
      });

      const oldPhones = user.phoneNumbers.filter(
        (p) => p.id !== newPhone.id
      );

      for (const phone of oldPhones) {
        await client.phoneNumbers.deletePhoneNumber(phone.id);
      }

      await client.users.updateUser(teacherId, {
        firstName: data.name,
        username: updatedUsername,
        password: updatedUsername,
      });
    }

    const {
      dob,
      subjects,
      ...restData
    } = data;

    const updateData: any = {
      ...restData,
      dob: dob ? new Date(dob) : undefined,
    };

    // ✅ Update teacher record
    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData,
    });

    // ✅ Update ClerkTeachers
    await prisma.clerkTeachers.update({
      where: { clerk_id: teacherId },
      data: {
        username: updatedUsername,
        password: data.phone,
        full_name: data.name,
        publicMetadata: { role: "teacher" },
      },
    });

    // ✅ Update subject-class mappings
    if (subjects && Array.isArray(subjects)) {
      await prisma.subjectTeacher.deleteMany({ where: { teacherId } });

      const validSubjects = subjects.filter(
        (s: any) => s.subjectId && s.classId
      );

      if (validSubjects.length > 0) {
        await prisma.subjectTeacher.createMany({
          data: validSubjects.map((s: any) => ({
            subjectId: s.subjectId,
            classId: s.classId,
            teacherId,
          })),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({ success: true, updatedTeacher }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/users/teachers/[id] error:", error);
    if (error.errors) console.error("Clerk error details:", error.errors);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.name === "ZodError" ? 400 : 500 }
    );
  }
}

// DELETE - Delete teacher
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacherId = id;

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }

    if (teacher.id) {
      await client.users.deleteUser(teacher.id);
    }

    await prisma.teacher.delete({
      where: { id: teacherId },
    });

    await prisma.clerkTeachers.deleteMany({
      where: { teacherId },
    });

    await prisma.subjectTeacher.deleteMany({
      where: { teacherId },
    });

    revalidatePath("/list/users/teachers");

    return NextResponse.json(
      { success: true, message: "Teacher deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/users/teachers/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}
