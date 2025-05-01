import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;

  try {
    // Step 1: Get Student → including their Class → including Grade
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        Class: {
          include: {
            Grade: true, // 💥 get Grade from Class
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const gradeId = student.Class?.gradeId; // ✅ Get gradeId through class

    if (!gradeId) {
      return NextResponse.json({ error: "Grade not found for student" }, { status: 404 });
    }

    // Step 2: Get Fee Structure for the Grade
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        gradeId: gradeId,
      },
    });

    // Step 3: Get Student's Fees if paid
    const studentFees = await prisma.studentFees.findMany({
      where: { studentId },
    });

    // Step 4: Merge FeeStructure + Paid Info
    const feesWithPaymentStatus = feeStructures.map((fee) => {
      const matchingPayment = studentFees.find((sf) => sf.feeStructureId === fee.id);

      return {
        feeStructureId: fee.id,
        studentId,
        term: fee.term,
        paidAmount: matchingPayment?.paidAmount || 0,
        discountAmount: matchingPayment?.discountAmount || 0,
        fineAmount: matchingPayment?.fineAmount || 0,
        receivedDate: matchingPayment?.receivedDate || null,
        paymentMode: matchingPayment?.paymentMode || null,
      };
    });

    return NextResponse.json(feesWithPaymentStatus, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
