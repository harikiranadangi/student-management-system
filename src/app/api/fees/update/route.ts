// src/app/api/fees/update/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      studentFeesId,
      amountPaid,
      discountAmount,
      fineAmount,
      receiptDate,
      receiptNo,
    } = body;

    console.log("Data received in API:", {
      studentFeesId,
      amountPaid,
      discountAmount,
      fineAmount,
      receiptDate,
      receiptNo,
    });

    // Step 1: Create a new FeeTransaction
    await prisma.feeTransaction.create({
      data: {
        studentFeesId,
        amountPaid,
        discountGiven: discountAmount,
        fineCollected: fineAmount,
        receiptNo,
        paymentDate: new Date(receiptDate),
      },
    });

    // Step 2: Update the StudentFees totals
    await prisma.studentFees.update({
      where: { id: studentFeesId },
      data: {
        paidAmount: {
          increment: amountPaid ?? 0,
        },
        discountAmount: {
          increment: discountAmount ?? 0,
        },
        fineAmount: {
          increment: fineAmount ?? 0,
        },
        receiptDate: receiptDate ? new Date(receiptDate) : undefined,
      },
    });

    return NextResponse.json({ message: "Fees collected successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating fee:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
