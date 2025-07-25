import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PaymentMode } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

function getTotalFees(fee: any) {
  const termFees = fee.feeStructure?.termFees ?? 0;
  const abacusFees = fee.feeStructure?.abacusFees ?? 0;
  return fee.term === "TERM_2" ? termFees + abacusFees : termFees;
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
    // ✅ 1. Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedByName = user.fullName ?? user.username ?? "Unknown";

    // ✅ 2. Parse request body
    const body = await req.json();
    const {
      studentId,
      term,
      amount = 0,
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

    // ✅ 3. Fetch student's fee record
    const studentFee = await prisma.studentFees.findFirst({
      where: { studentId, term },
      include: { feeStructure: true },
    });

    if (!studentFee) {
      return NextResponse.json({ message: "Student fee record not found." }, { status: 404 });
    }

    const dueAmount = calculateDueAmount(studentFee);
    const totalIncomingAmount = amount + discountAmount + fineAmount;

    if (totalIncomingAmount > dueAmount) {
      return NextResponse.json(
        {
          message: `Overpayment not allowed. Due: ₹${dueAmount}, Attempted: ₹${totalIncomingAmount}`,
        },
        { status: 400 }
      );
    }

    // ✅ 4. Update studentFees table
    const updatedFee = await prisma.studentFees.update({
      where: { id: studentFee.id },
      data: {
        paidAmount: studentFee.paidAmount + amount,
        discountAmount: studentFee.discountAmount + discountAmount,
        fineAmount: studentFee.fineAmount + fineAmount,
        remarks,
        paymentMode,
        ...(receiptDate && { receiptDate: new Date(receiptDate) }),
        ...(receiptNo && { receiptNo: String(receiptNo) }),
      },
    });

    // ✅ 5. Update receiptNo for all terms (optional behavior)
    if (receiptNo) {
      await prisma.studentFees.updateMany({
        where: { studentId },
        data: { receiptNo: String(receiptNo) },
      });
    }

    // ✅ 6. Update studentTotalFees table
    const updatedTotalFee = await prisma.studentTotalFees.upsert({
      where: { studentId },
      update: {
        totalPaidAmount: { increment: amount },
        totalDiscountAmount: { increment: discountAmount },
        totalFineAmount: { increment: fineAmount },
        totalFeeAmount: { increment: totalIncomingAmount },
      },
      create: {
        studentId,
        totalPaidAmount: amount,
        totalDiscountAmount: discountAmount,
        totalFineAmount: fineAmount,
        totalFeeAmount: totalIncomingAmount,
        totalAbacusAmount: 0,
      },
    });

    // ✅ 7. Insert FeeTransaction
    const newTransaction = await prisma.feeTransaction.create({
      data: {
        studentId,
        term,
        studentFeesId: studentFee.id,
        amount,
        discountAmount,
        fineAmount,
        receiptDate: new Date(receiptDate),
        receiptNo: String(receiptNo),
        paymentMode,
        remarks,
        updatedByName,
      },
    });

    return NextResponse.json(
      {
        message: "Fee updated and transaction recorded.",
        updatedFee,
        updatedTotalFee,
        transaction: newTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as any)?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
