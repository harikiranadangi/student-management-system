import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { studentId, term, cancelledBy, reason } = await req.json();

    if (!studentId || !term) {
      return NextResponse.json({ message: "studentId and term are required." }, { status: 400 });
    }

    // Step 1: Aggregate
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

    // Step 2: Get receiptNo before reset
    const studentFee = await prisma.studentFees.findFirst({
      where: { studentId, term },
      select: { receiptNo: true },
    });

    const receiptNo = studentFee?.receiptNo || "N/A";

    // Step 3: Transaction
    await prisma.$transaction(async (tx) => {
      // 3.1 Delete fee transactions
      await tx.feeTransaction.deleteMany({
        where: { studentId, term },
      });

      // 3.2 Reset studentFees
      await tx.studentFees.updateMany({
        where: { studentId, term },
        data: {
          paidAmount: 0,
          discountAmount: 0,
          fineAmount: 0,
          receiptDate: null,
          receiptNo: null,
          remarks: null,
        },
      });

      // 3.3 Update studentTotalFees
      if (totalFeeAmount > 0) {
        const studentTotal = await tx.studentTotalFees.findUnique({
          where: { studentId },
          select: {
            totalPaidAmount: true,
            totalDiscountAmount: true,
            totalFineAmount: true,
            totalFeeAmount: true,
          },
        });

        if (studentTotal) {
          await tx.studentTotalFees.update({
            where: { studentId },
            data: {
              totalPaidAmount: Math.max(0, (studentTotal.totalPaidAmount || 0) - totalPaidAmount),
              totalDiscountAmount: Math.max(0, (studentTotal.totalDiscountAmount || 0) - totalDiscountAmount),
              totalFineAmount: Math.max(0, (studentTotal.totalFineAmount || 0) - totalFineAmount),
              totalFeeAmount: Math.max(0, (studentTotal.totalFeeAmount || 0) - totalFeeAmount),
            },
          });
        }
      }

      // 3.4 Log cancelled receipt
      if (totalFeeAmount > 0) {
        await tx.cancelledReceipt.create({
          data: {
            studentId,
            term,
            originalReceiptNo: receiptNo,
            cancelledAmount: totalPaidAmount,
            cancelledDiscount: totalDiscountAmount,
            cancelledFine: totalFineAmount,
            cancelledTotal: totalFeeAmount,
            cancelledBy,
            reason,
          },
        });
      }
    });

    return NextResponse.json({ message: "Fee transactions cancelled successfully." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong.", error: error.message }, { status: 500 });
  }
}
