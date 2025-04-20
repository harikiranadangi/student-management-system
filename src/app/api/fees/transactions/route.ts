import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getMessageContent } from "@/lib/utils/messageUtils";
import { MessageType } from "../../../../../types";

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

    // Step 1: Update studentFees
    const updatedFee = await prisma.studentFees.updateMany({
      where: { studentId, term },
      data: feeDataToUpdate,
    });

    // Step 2: Update receiptNo for all terms
    if (receiptNo != null) {
      await prisma.studentFees.updateMany({
        where: { studentId },
        data: { receiptNo: String(receiptNo) },
      });
    }

    // Step 3: Get studentFee record
    const studentFeesRecord = await prisma.studentFees.findFirst({
      where: { studentId, term },
    });

    if (!studentFeesRecord) {
      return NextResponse.json(
        { message: "StudentFees not found for creating transaction." },
        { status: 404 }
      );
    }

    const selectedId = studentFeesRecord.id;
    const selectedPaymentMode = studentFeesRecord.paymentMode;
    const paidFees = studentFeesRecord.paidAmount;
    const paiddiscount = studentFeesRecord.discountAmount;
    const paidFine = studentFeesRecord.fineAmount;
    const remark = studentFeesRecord.remarks;

    // Step 4: Create FeeTransaction
    const feeTransaction = await prisma.feeTransaction.create({
      data: {
        studentId,
        term,
        studentFeesId: selectedId,
        amount: paidFees,
        discountAmount: paiddiscount,
        fineAmount: paidFine,
        receiptDate: receiptDate ? new Date(receiptDate) : new Date(),
        receiptNo: receiptNo ? String(receiptNo) : "",
        paymentMode: selectedPaymentMode,
        remarks: remark,
      },
    });

    await prisma.feeTransaction.updateMany({
      where: { studentId },
      data: {
        receiptNo: receiptNo ? String(receiptNo) : "",
      },
    });

    // Step 5: Fetch student + class for message
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { Class: true },
    });

    if (student) {
      const message = getMessageContent("FEE_COLLECTION" as MessageType, {
        name: student.name,
        className: student.Class?.name ?? "Unknown",
        amount: paidFees,
        term,
      });

      await prisma.messages.create({
        data: {
          message,
          type: "FEE_COLLECTION",
          date: new Date().toISOString(),
          classId: student.classId ?? null,
          studentId,
        },
      });
    }

    return NextResponse.json({ updatedFee, feeTransaction }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
