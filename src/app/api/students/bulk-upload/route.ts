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

      // ✅ Step 1: Ensure Profile exists for this phone
      let profile = await prisma.profile.findUnique({
        where: { phone },
        include: { roles: true },
      });

      if (!profile) {
        profile = await prisma.profile.create({
          data: {
            phone,
            clerk_id: providedClerkId || "", // temporary empty if Clerk not created yet
          },
          include: { roles: true },
        });
      }

      // ✅ Step 2: Ensure Student Role exists for this profile
      const studentUsername = `s${id}`;
      let role = profile.roles.find((r) => r.role === "student");

      if (!role) {
        role = await prisma.role.create({
          data: {
            role: "student",
            username: studentUsername,
            profileId: profile.id,
          },
        });
      }

      // ✅ Step 3: Upsert Student entity linked to Profile
      let student = await prisma.student.findUnique({ where: { id } });

      if (student) {
        student = await prisma.student.update({
          where: { id },
          data: {
            username: studentUsername,
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
            clerk_id: providedClerkId || profile.clerk_id,
            academicYear,
            profileId: profile.id,
          },
        });
        updated++;
      } else {
        student = await prisma.student.create({
          data: {
            id,
            username: studentUsername,
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
            clerk_id: providedClerkId || profile.clerk_id,
            academicYear,
            profileId: profile.id,
          },
        });
        created++;
      }

      console.log(`Processed student: ${id} - ${name} (${student.id})`);

      // ✅ Step 4: Fee structure mapping (unchanged)
      const feeStructures = await prisma.feeStructure.findMany({
        where: { gradeId: cls.Grade.id, academicYear },
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
