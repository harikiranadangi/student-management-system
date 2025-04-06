import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, term, paidAmount, discountAmount, fineAmount, receiptDate } = body;

    const data: any = {
      paidAmount,
      discountAmount,
      fineAmount,
    };

    // 👇 Only add receiptDate if it exists
    if (receiptDate) {
      data.receiptDate = new Date(receiptDate);
    }

    const updatedFee = await prisma.studentFees.updateMany({
      where: { studentId, term },
      data,
    });

    return NextResponse.json(updatedFee, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
  }
}
