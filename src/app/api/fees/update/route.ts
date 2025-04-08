import prisma from "@/lib/prisma";
import { PaymentMode } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentId,
      term,
      paidAmount,
      discountAmount,
      fineAmount,
      receiptDate,
      receiptNo,
      remarks,
      paymentMode = "CASH", // Default to CASH
    } = body;

    if (!studentId || !term) {
      return NextResponse.json({ message: "studentId and term are required." }, { status: 400 });
    }

    const feeDataToUpdate: Partial<{
      paidAmount: number;
      discountAmount: number;
      fineAmount: number;
      remarks: string;
      receiptDate: Date;
      receiptNo: string;
      paymentMode: PaymentMode
    }> = {
      paidAmount,
      discountAmount,
      fineAmount,
      remarks,
      paymentMode,
    };

    if (receiptDate) {
      feeDataToUpdate.receiptDate = new Date(receiptDate);
    }

    if (receiptNo) {
      feeDataToUpdate.receiptNo = String(receiptNo);
    }

    // Update studentFees record
    const updatedFee = await prisma.studentFees.updateMany({
      where: { studentId, term },
      data: feeDataToUpdate,
    });

    return NextResponse.json({ updatedFee }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
