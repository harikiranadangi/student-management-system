import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { studentFeesId, receiptNo,  amountPaid,  discountGiven, fineCollected } = await req.json();

  const studentFee = await prisma.studentFees.findUnique({
    where: { id: studentFeesId },
  });

  if (!studentFee) return NextResponse.json({ error: "Fee record not found" }, { status: 404 });


  // Create Fee Transaction
  const transaction = await prisma.feeTransaction.create({
    data: {
      studentFeesId,
      receiptNo,
      amountPaid,
      paymentDate: new Date(),
      fineCollected,
      discountGiven,
      
    },
  });

  // Update StudentFees record
  await prisma.studentFees.update({
    where: { id: studentFeesId },
    data: {
      paidAmount: { increment: amountPaid },
      discountAmount: { increment: discountGiven },
    },
  });

  return NextResponse.json({ message: "Fees collected successfully", transaction });
}
