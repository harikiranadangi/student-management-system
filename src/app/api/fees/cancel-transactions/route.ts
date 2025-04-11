import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { studentId, term } = await req.json();

    if (!studentId || !term) {
      return NextResponse.json({ message: "studentId and term are required." }, { status: 400 });
    }

    // Step 1: Aggregate total amounts directly from DB (no need to fetch all transactions)
    const aggregates = await prisma.feeTransaction.aggregate({
      where: { studentId, term },
      _sum: {
        amount: true,
        discountAmount: true,
        fineAmount: true,
      },
    });

    const totalPaidAmount = aggregates._sum.amount || 0;
    const totalDiscountAmount = aggregates._sum.discountAmount || 0;
    const totalFineAmount = aggregates._sum.fineAmount || 0;
    const totalFeeAmount = totalPaidAmount + totalDiscountAmount + totalFineAmount;

    // Step 2: Delete fee transactions + Update student fees + Update student total fees — in parallel
    await Promise.all([
      prisma.feeTransaction.deleteMany({
        where: { studentId, term },
      }),
      prisma.studentFees.updateMany({
        where: { studentId, term },
        data: {
          paidAmount: 0,
          discountAmount: 0,
          fineAmount: 0,
          receiptDate: null,
          receiptNo: null,
          remarks: null,
        },
      }),
      // Only update studentTotalFees if there was something collected
      totalPaidAmount > 0 || totalDiscountAmount > 0 || totalFineAmount > 0
        ? prisma.studentTotalFees.update({
            where: { studentId },
            data: {
              totalPaidAmount: { decrement: totalPaidAmount },
              totalDiscountAmount: { decrement: totalDiscountAmount },
              totalFineAmount: { decrement: totalFineAmount },
              totalFeeAmount: { decrement: totalFeeAmount },
            },
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ message: "Transactions cancelled and fees reset successfully" });
    
  } catch (error) {
    console.error("Error cancelling transactions:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
