import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming request body to /api/fees/update:", body);

    const {
      studentId,
      term,
      amount,
      discountAmount,
      fineAmount,
      receiptDate,
      receiptNo,
      remarks,
    } = body;

    if (
      !studentId ||
      !term ||
      amount == null ||
      discountAmount == null ||
      fineAmount == null
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const fee = await prisma.studentFees.findFirst({
      where: {
        studentId,
        term,
      },
      include: {
        feeStructure: true,
      },
    });

    if (!fee || !fee.feeStructure) {
      return NextResponse.json({ message: "Student fee record not found" }, { status: 404 });
    }

    const newPaid = fee.paidAmount + amount;
    const newDiscount = fee.discountAmount + discountAmount;
    const newFine = fee.fineAmount + fineAmount;

    const totalCollected = newPaid + newFine - newDiscount;
    const termFee = fee.feeStructure.termFees;

    if (totalCollected > termFee) {
      const due = termFee - (fee.paidAmount + fee.fineAmount - fee.discountAmount);
      return NextResponse.json(
        {
          message: `Overpayment not allowed. Due: ₹${due}, Attempted: ₹${totalCollected}`,
        },
        { status: 400 }
      );
    }

    // ✅ Safely handle receiptDate
    const parsedReceiptDate = receiptDate ? new Date(receiptDate) : undefined;
    if (parsedReceiptDate && isNaN(parsedReceiptDate.getTime())) {
      return NextResponse.json({ message: "Invalid receipt date format" }, { status: 400 });
    }

    await prisma.studentFees.update({
      where: { id: fee.id },
      data: {
        paidAmount: newPaid,
        discountAmount: newDiscount,
        fineAmount: newFine,
        receiptDate: parsedReceiptDate,
        receiptNo,
        remarks,
      },
    });

    return NextResponse.json({ message: "Fees updated successfully" });
  } catch (error) {
    console.error("Error updating fees:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
