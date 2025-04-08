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
      paymentMode = PaymentMode, // Default to CASH if not provided
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
    }> = {
      paidAmount,
      discountAmount,
      fineAmount,
      remarks,
    };

    if (receiptDate) {
      feeDataToUpdate.receiptDate = new Date(receiptDate);
    }

    // Step 1: Update studentFees for specific student and term
    const updatedFee = await prisma.studentFees.updateMany({
      where: { studentId, term },
      data: feeDataToUpdate,
    });

    // Step 2: If receiptNo is provided, update it for ALL student's fees (across terms)
    if (receiptNo != null) {
      await prisma.studentFees.updateMany({
        where: { studentId },
        data: { receiptNo: String(receiptNo) },
      });
    }

    // Step 3: Find the studentFees record for linking FeeTransaction
    const studentFeesRecord = await prisma.studentFees.findFirst({
      where: { studentId, term },
    });

    if (!studentFeesRecord) {
      return NextResponse.json(
        { message: "StudentFees not found for creating transaction." },
        { status: 404 }
      );
    }

    
    const selectedPaymentMode = studentFeesRecord.paymentMode;
    const paidFees = studentFeesRecord.paidAmount; 
    const paiddiscount = studentFeesRecord.discountAmount; 
    const paidFine = studentFeesRecord.fineAmount; 

    
    // Step 4: Create a new FeeTransaction linked to studentFees
    const feeTransaction = await prisma.feeTransaction.create({
      data: {
        studentId,
        term,
        studentFeesId: studentFeesRecord.id,
        amount: paidFees,
        discountAmount: paiddiscount,
        fineAmount: paidFine,
        receiptDate: receiptDate ? new Date(receiptDate) : new Date(),
        receiptNo: receiptNo ? String(receiptNo) : "",
        paymentMode: selectedPaymentMode, // Use dynamic payment mode
      },
    });

    console.log("FeeTransaction created:", feeTransaction);

    return NextResponse.json({ updatedFee, feeTransaction }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
