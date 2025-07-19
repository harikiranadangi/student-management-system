import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Helper: Parse DOB in dd-mm-yyyy format
function parseDDMMYYYY(dob: string): Date | null {
  const [dd, mm, yyyy] = dob.split("-");
  if (!dd || !mm || !yyyy) return null;
  const iso = `${yyyy}-${mm}-${dd}`;
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
}

export async function POST(req: NextRequest) {
  try {
    const { students } = await req.json();

    if (!Array.isArray(students)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    let created = 0;
    let updated = 0;
    let feesMapped = 0;
    let clerkCreated = 0;
    const errors: string[] = [];
    // ✅ Step 3: Check if Clerk user already exists
    const client = await clerkClient();

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const {
        id,
        username: rawUsername,
        name,
        parentName,
        email,
        phone,
        address,
        img,
        bloodType,
        gender,
        dob,
        classId,
        clerk_id: providedClerkId,
        academicYear,
      } = s;

      if (!id || !rawUsername || !name || !dob || !classId || !phone) {
        errors.push(`Missing required fields for student: ${rawUsername || id}`);
        continue;
      }

      const parsedDob = parseDDMMYYYY(dob);
      if (!parsedDob) {
        errors.push(`Invalid DOB format for student: ${id} (${dob})`);
        continue;
      }

      const cls = await prisma.class.findUnique({
        where: { id: Number(classId) },
        include: { Grade: true },
      });

      if (!cls || !cls.Grade) {
        errors.push(`Invalid classId or missing grade for student ID: ${id}`);
        continue;
      }

      const existing = await prisma.student.findUnique({ where: { id } });

      const generatedUsername = `s${id}`;
      const password = phone;
      const phoneNumber = `+91${phone}`;

      let finalClerkId = providedClerkId || null;

      // ✅ Try to create Clerk user only for first 50 students
      if (!IS_PRODUCTION && clerkCreated < 50 && !providedClerkId) {
        try {
          const existingUsers = await client.users.getUserList({
            username: [generatedUsername],
          });

          const userExists = existingUsers.data.some(
            (u) => u.username === generatedUsername
          );

          if (!userExists) {
            const user = await client.users.createUser({
              username: generatedUsername,
              password,
              firstName: name,
              phoneNumber: [phoneNumber],
            });

            await client.users.updateUser(user.id, {
              publicMetadata: { role: "student" },
            });

            finalClerkId = user.id;
            clerkCreated++;
          }
        } catch (err: any) {
          errors.push(`Failed to create Clerk user for student ${id}: ${err.message}`);
        }
      }

      let student;
      if (existing) {
        student = await prisma.student.update({
          where: { id },
          data: {
            username: generatedUsername,
            name,
            parentName,
            email,
            phone,
            address,
            img,
            bloodType,
            gender,
            dob: parsedDob,
            classId: Number(classId),
            clerk_id: finalClerkId,
            academicYear,
          },
        });
        updated++;
      } else {
        student = await prisma.student.create({
          data: {
            id,
            username: generatedUsername,
            name,
            parentName,
            email,
            phone,
            address,
            img,
            bloodType,
            gender,
            dob: parsedDob,
            classId: Number(classId),
            clerk_id: finalClerkId,
            academicYear,
          },
        });
        created++;
      }

      // ✅ Create ClerkStudents only if Clerk ID exists and student is now in DB
      if (finalClerkId && !IS_PRODUCTION && clerkCreated <= 50) {
        try {
          await prisma.clerkStudents.create({
            data: {
              clerk_id: finalClerkId,
              username: generatedUsername,
              password: generatedUsername,
              full_name: name,
              user_id: finalClerkId,
              role: "student",
              studentId: student.id,
            },
          });
        } catch (err: any) {
          errors.push(`ClerkStudent insert failed for student ${id}: ${err.message}`);
        }
      }

      // ✅ Fee structure mapping
      const feeStructures = await prisma.feeStructure.findMany({
        where: {
          gradeId: cls.Grade.id,
          academicYear,
        },
      });

      if (feeStructures.length === 0) {
        errors.push(
          `No fee structure for student ${id} (grade: ${cls.Grade.id}, year: ${academicYear})`
        );
        continue;
      }

      await prisma.studentFees.createMany({
        data: feeStructures.map((fee) => ({
          studentId: id,
          feeStructureId: fee.id,
          academicYear,
          term: fee.term,
          paidAmount: 0,
          discountAmount: 0,
          fineAmount: 0,
          abacusPaidAmount: 0,
          receivedDate: null,
          receiptDate: null,
          paymentMode: "CASH",
        })),
        skipDuplicates: true,
      });

      feesMapped++;
    }

    return NextResponse.json({
      message: `✅ Upload complete: Created: ${created}, Updated: ${updated}, Fees Mapped: ${feesMapped}, Clerk Created: ${clerkCreated}`,
      errors,
    });
  } catch (error) {
    console.error("💥 Bulk upload failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
