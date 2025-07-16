import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    const errors: string[] = [];

    for (const s of students) {
      const {
        id,
        username,
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
        clerk_id,
        academicYear,
      } = s;

      if (!id || !username || !name || !dob || !classId || !phone) {
        errors.push(`Missing required fields for student: ${username || id}`);
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

      if (existing) {
        if (clerk_id && clerk_id !== existing.clerk_id) {
          const conflict = await prisma.student.findFirst({
            where: { clerk_id, NOT: { id } },
          });
          if (conflict) {
            errors.push(`Duplicate clerk_id: ${clerk_id} for student ID: ${id}`);
            continue;
          }
        }

        await prisma.student.update({
          where: { id },
          data: {
            username,
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
            clerk_id: clerk_id || null,
            academicYear,
          },
        });

        updated++;
      } else {
        if (clerk_id) {
          const conflict = await prisma.student.findFirst({
            where: { clerk_id },
          });
          if (conflict) {
            errors.push(`Duplicate clerk_id on create: ${clerk_id} for student ID: ${id}`);
            continue;
          }
        }

        await prisma.student.create({
          data: {
            id,
            username,
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
            clerk_id: clerk_id || null,
            academicYear,
          },
        });

        created++;
      }

      // Fee mapping logic
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
      message: `✅ Upload complete: Created: ${created}, Updated: ${updated}, Fees Mapped: ${feesMapped}`,
      errors,
    });
  } catch (error) {
    console.error("💥 Bulk upload failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
