import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { studentschema } from "@/lib/formValidationSchemas";
import { AcademicYear } from "@prisma/client";

const client = await clerkClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate input
    const parsed = studentschema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      id: requestedId,
      name,
      phone,
      classId,
      academicYear,
      dob,
      email,
      gender,
      fatherName,
      motherName,
      penNo,
      motherAadhar,
      fatherAadhar,
      studentAadhar,
      bloodType,
      address,
      img,
    } = parsed.data;

    // ✅ Normalize year to enum-safe value
    const normalizedYear = academicYear
      ?.trim()
      .toUpperCase() as keyof typeof AcademicYear;
    console.log("🎓 Requested academic year:", normalizedYear);

    if (!AcademicYear[normalizedYear]) {
      console.error("❌ Invalid academic year:", normalizedYear);
      return NextResponse.json(
        { message: `Invalid academic year: ${normalizedYear}` },
        { status: 400 }
      );
    }

    // ✅ Generate ID
    let id = requestedId;
    if (!id) {
      const last = await prisma.student.findFirst({
        orderBy: { id: "desc" },
        select: { id: true },
      });
      id = last?.id ? (parseInt(last.id.toString()) + 1).toString() : "10000";
    }

    const username = `s${id}`;
    const phoneNumber = `+91${phone}`;
    const password = phone;

    // ✅ Find or create Clerk user
    const existing = await client.users.getUserList({
      phoneNumber: [phoneNumber],
    });
    const parentUser =
      existing.data[0] ??
      (await client.users.createUser({
        username,
        password,
        firstName: name,
        phoneNumber: [phoneNumber],
        publicMetadata: { role: "student" },
      }));

    // ✅ Upsert profile
    const profile = await prisma.profile.upsert({
      where: { clerk_id: parentUser.id },
      update: {},
      create: { clerk_id: parentUser.id, phone },
    });

    // ✅ Prevent duplicate username
    const duplicate = await prisma.student.findUnique({ where: { username } });
    if (duplicate) {
      return NextResponse.json(
        { message: `Student username "${username}" already exists.` },
        { status: 409 }
      );
    }

    // ✅ Transaction — create student and assign fees (only selected year)
    const student = await prisma.$transaction(async (tx) => {
      // ✅ Step 5: Create Student record linked to parent’s Clerk ID
      console.log("Creating student with ID:", id);

      const studentData: any = {
        id,
        username,
        name,
        fatherName,
        motherName,
        email: email ?? undefined,
        phone,
        penNo,
        motherAadhar,
        fatherAadhar,
        studentAadhar,
        address,
        gender,
        img: img ?? undefined,
        bloodType,
        classId,
        academicYear: normalizedYear as AcademicYear,
        clerk_id: parentUser.id,
        profileId: profile.id,
      };

      // ✅ Only add dob if provided
      if (dob) {
        studentData.dob = new Date(dob);
      }

      const newStudent = await tx.student.create({
        data: studentData,
      });

      console.log("🧩 Student created:", newStudent.username);

      // ✅ Get gradeId
      const classData = await tx.class.findUnique({
        where: { id: classId },
        select: { gradeId: true },
      });
      if (!classData) throw new Error("Class not found for student");

      console.log("🏫 Grade ID:", classData.gradeId);

      // ✅ Fetch only intended year’s fee structures
      const feeStructures = await tx.feeStructure.findMany({
        where: {
          gradeId: classData.gradeId,
          academicYear: normalizedYear as AcademicYear,
        },
      });

      console.log(
        `🎯 Found ${feeStructures.length} fee structures for ${normalizedYear}`
      );
      console.table(
        feeStructures.map((f) => ({
          id: f.id,
          term: f.term,
          academicYear: f.academicYear,
        }))
      );

      if (feeStructures.length === 0) {
        console.warn(`⚠️ No fee structures found for ${normalizedYear}`);
        return newStudent;
      }

      // ✅ Prevent duplicates
      const existingFees = await tx.studentFees.findMany({
        where: { studentId: newStudent.id },
      });

      console.log("🧾 Existing student fees count:", existingFees.length);

      if (existingFees.length === 0) {
        await tx.studentFees.createMany({
          data: feeStructures.map((f) => ({
            studentId: newStudent.id,
            feeStructureId: f.id,
            academicYear: f.academicYear,
            term: f.term,
            paidAmount: 0,
            discountAmount: 0,
            fineAmount: 0,
            abacusPaidAmount: 0,
            paymentMode: "CASH",
            receiptDate: new Date(),
          })),
        });

        console.log(
          `✅ Assigned ${feeStructures.length} fees for year ${normalizedYear}`
        );
      } else {
        console.log("⚠️ Fees already mapped — skipping duplicates.");
      }

      return newStudent;
    });

    return NextResponse.json(
      { message: "✅ Student created successfully", student },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating student:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Duplicate record found (username or fees)." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
