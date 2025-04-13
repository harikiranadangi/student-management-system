import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PaymentMode } from "@prisma/client";

function getTotalFees(fee: any) {
  const termFees = fee.feeStructure?.termFees ?? 0;
  const abacusFees = fee.feeStructure?.abacusFees ?? 0;

  if (fee.term === "TERM_2") {
    return termFees + abacusFees; // include Abacus only for Term 2
  } else {
    return termFees; // for Term 1 or others, only Term Fees
  }
}

function calculateDueAmount(fee: any) {
  const totalFees = getTotalFees(fee);
  const paidAmount = fee.paidAmount ?? 0;
  const discountAmount = fee.discountAmount ?? 0;
  const fineAmount = fee.fineAmount ?? 0;

  return totalFees - paidAmount - discountAmount + fineAmount;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentId,
      term,
      paidAmount = 0,
      discountAmount = 0,
      fineAmount = 0,
      receiptDate,
      receiptNo,
      remarks,
      paymentMode = PaymentMode.CASH,
    } = body;

    if (!studentId || !term) {
      return NextResponse.json({ message: "studentId and term are required." }, { status: 400 });
    }

    const studentFee = await prisma.studentFees.findFirst({
      where: { studentId, term },
      include: { feeStructure: true },
    });

    if (!studentFee) {
      return NextResponse.json({ message: "Student fee record not found." }, { status: 404 });
    }

    const dueAmount = calculateDueAmount(studentFee);

    const totalIncomingAmount = paidAmount + discountAmount;

    if (totalIncomingAmount > dueAmount) {
      return NextResponse.json(
        {
          message: `Overpayment not allowed. Due: ₹${dueAmount}, Attempted: ₹${totalIncomingAmount}`,
        },
        { status: 400 }
      );
    }

    const feeDataToUpdate = {
      paidAmount: studentFee.paidAmount + paidAmount,
      discountAmount: studentFee.discountAmount + discountAmount,
      fineAmount: studentFee.fineAmount + fineAmount,
      remarks,
      paymentMode,
      ...(receiptDate && { receiptDate: new Date(receiptDate) }),
      ...(receiptNo && { receiptNo: String(receiptNo) }),
    };

    // 1. Update StudentFees for the specific term
    const updatedFee = // 1. Update StudentFees for the specific term
    await prisma.studentFees.update({
      where: { id: studentFee.id },
      data: feeDataToUpdate,
    });

    // 2. Update all terms for the student (if receiptNo is provided)
    if (receiptNo) {
      await prisma.studentFees.updateMany({
        where: { studentId },
        data: { receiptNo: String(receiptNo) },
      });
    }

    // 3. 🔥 Fetch latest updated studentFee
    const updatedStudentFee = await prisma.studentFees.findFirst({
      where: { studentId, term },
    });

    // 3. Upsert into StudentTotalFees
    const totalIncrementAmount = paidAmount + discountAmount + fineAmount;

    const updatedTotalFee = await prisma.studentTotalFees.upsert({
      where: { studentId },
      update: {
        totalPaidAmount: { increment: paidAmount },
        totalDiscountAmount: { increment: discountAmount },
        totalFineAmount: { increment: fineAmount },
        totalFeeAmount: { increment: totalIncrementAmount },
      },
      create: {
        studentId,
        totalPaidAmount: paidAmount,
        totalDiscountAmount: discountAmount,
        totalFineAmount: fineAmount,
        totalFeeAmount: totalIncrementAmount,
        totalAbacusAmount: 0,
      },
    });

    return NextResponse.json({ updatedStudentFee, updatedFee, updatedTotalFee }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as any)?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
