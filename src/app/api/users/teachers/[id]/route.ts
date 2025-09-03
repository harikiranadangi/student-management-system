import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { teacherschema } from "@/lib/formValidationSchemas";
import { revalidatePath } from "next/cache";

const client = await clerkClient();

// ✅ PUT - Update teacher
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const teacherId = id;
    const body = await req.json();

    // ✅ Validate with schema
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

    // 🔍 Clerk user
    const user = await client.users.getUser(existingTeacher.clerk_id!);
    const formattedNewPhone = `+91${data.phone}`;
    const updatedUsername = data.username || `t${teacherId}`;

    // 🔍 Check if number is already in use by another Clerk user
    const usersWithPhone = await client.users.getUserList({
      phoneNumber: [formattedNewPhone],
    });

    if (usersWithPhone.totalCount > 0) {
      const otherUser = usersWithPhone.data.find(
        (u) => u.id !== existingTeacher.clerk_id
      );
      if (otherUser) {
        return NextResponse.json(
          {
            success: false,
            error: "Phone number already in use by another account",
          },
          { status: 422 }
        );
      }
    }

    // 1. Add new phone number
    const newPhone = await client.phoneNumbers.createPhoneNumber({
      userId: existingTeacher.clerk_id!,
      phoneNumber: formattedNewPhone,
    });

    // 2. Verify it
    await client.phoneNumbers.updatePhoneNumber(newPhone.id, {
      verified: true,
    });

    // 3. Set new number as primary
    await client.users.updateUser(existingTeacher.clerk_id!, {
      firstName: data.name,
      username: updatedUsername,
      password: data.phone, // ⚠️ consider not using phone as password
      primaryPhoneNumberID: newPhone.id,
    });

    // 4. Now delete all NON-primary numbers
    const freshUser = await client.users.getUser(existingTeacher.clerk_id!);

    for (const phone of freshUser.phoneNumbers) {
      if (phone.id !== newPhone.id) {
        try {
          await client.phoneNumbers.deletePhoneNumber(phone.id);
          console.log("Deleted old phone:", phone.phoneNumber);
        } catch (err) {
          console.warn("Failed to delete old phone:", phone.phoneNumber, err);
        }
      }
    }

    // ✅ Update Teacher in DB
    const { dob, subjects, password, ...restData } = data;

    const updateData: any = {
      ...restData,
      dob: dob ? new Date(dob) : undefined,
    };

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData,
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

// ✅ DELETE - Delete teacher
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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

    // Run Prisma + Clerk deletions in parallel
    await Promise.all([
      teacher.clerk_id ? client.users.deleteUser(teacher.clerk_id) : null,
      prisma.teacher.delete({ where: { id: teacherId } }),
      prisma.subjectTeacher.deleteMany({ where: { teacherId } }),
    ]);

    revalidatePath("/list/users/teachers");

    return NextResponse.json(
      { success: true, message: "Teacher deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/users/teachers/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
