import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, term, paidAmount, discountAmount, fineAmount, receiptDate, receiptNo, remarks } = body;

    const feeDataToUpdate: any = {
      paidAmount,
      discountAmount,
      fineAmount,
      remarks,
    };

    if (receiptDate) {
      feeDataToUpdate.receiptDate = new Date(receiptDate);
    }

    // First, update the specific term's amount, discount, fine, etc.
    const updatedFee = await prisma.studentFees.updateMany({
      where: { studentId, term },
      data: feeDataToUpdate,
    });

    // Now, if receiptNo is given, update ALL terms' receiptNo
    if (receiptNo !== undefined && receiptNo !== null) {
      await prisma.studentFees.updateMany({
        where: { studentId },
        data: { receiptNo: String(receiptNo) },
      });
    }

    return NextResponse.json(updatedFee, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
  }
}
