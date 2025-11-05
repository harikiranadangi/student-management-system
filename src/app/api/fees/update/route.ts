import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PaymentMode } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { getMessageContent } from "@/lib/utils/messageUtils";

// 🧮 Helper to compute total and due amounts
function getTotalFees(fee: any) {
  const termFees = fee.feeStructure?.termFees ?? 0;
  const abacusFees = fee.feeStructure?.abacusFees ?? 0;
  return termFees + abacusFees;
}

function calculateDueAmount(fee: any) {
  const totalFees = getTotalFees(fee);
  const paidAmount = fee.paidAmount ?? 0;
  const discountAmount = fee.discountAmount ?? 0;
  const fineAmount = fee.fineAmount ?? 0;
  return totalFees - paidAmount - discountAmount + fineAmount;
}

// 🧾 Main handler
export async function POST(req: NextRequest) {
  try {
    // ✅ Step 1: Validate user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const updatedByName = user.fullName ?? user.username ?? "Unknown";

    // ✅ Step 2: Parse request body
    const body = await req.json();
    console.log("📦 Incoming body:", body);

    const {
      studentId,
      term,
      amount = 0,
      discountAmount = 0,
      fineAmount = 0,
      receiptDate,
      receiptNo,
      remarks,
      paymentMode = PaymentMode.CASH,
    } = body;

    if (!studentId || !term) {
      return NextResponse.json(
        { message: "❌ studentId and term are required." },
        { status: 400 }
      );
    }

    // ✅ Step 3: Get student fee record
    const studentFee = await prisma.studentFees.findFirst({
      where: { studentId, term },
      include: { feeStructure: true },
    });

    if (!studentFee) {
      return NextResponse.json(
        { message: "❌ Student fee record not found." },
        { status: 404 }
      );
    }

    const academicYear = studentFee.academicYear;
    if (!academicYear) {
      return NextResponse.json(
        { message: "❌ Missing academic year in studentFees record." },
        { status: 400 }
      );
    }

    // ✅ Step 4: Calculate and validate payment
    const dueAmount = calculateDueAmount(studentFee);
    const totalIncomingAmount = amount + discountAmount + fineAmount;

    if (totalIncomingAmount > dueAmount) {
      return NextResponse.json(
        {
          message: `❌ Overpayment not allowed. Due: ₹${dueAmount}, Attempted: ₹${totalIncomingAmount}`,
        },
        { status: 400 }
      );
    }

    // ✅ Step 5: Parse receipt date safely
    const parsedReceiptDate =
      receiptDate && !isNaN(Date.parse(receiptDate))
        ? new Date(receiptDate)
        : new Date();

    // ✅ Step 6: Update studentFees
    const updatedFee = await prisma.studentFees.update({
      where: { id: studentFee.id },
      data: {
        paidAmount: studentFee.paidAmount + amount,
        discountAmount: studentFee.discountAmount + discountAmount,
        fineAmount: studentFee.fineAmount + fineAmount,
        remarks,
        paymentMode,
        receiptDate: parsedReceiptDate,
        ...(receiptNo && { receiptNo: String(receiptNo) }),
      },
    });

    // ✅ Step 7: Update all receipts of the same year (optional)
    if (receiptNo) {
      await prisma.studentFees.updateMany({
        where: { studentId, academicYear },
        data: { receiptNo: String(receiptNo) },
      });
    }

    // ✅ Step 8: Update totals
    const updatedTotalFee = await prisma.studentTotalFees.upsert({
      where: { studentId },
      update: {
        totalPaidAmount: { increment: amount },
        totalDiscountAmount: { increment: discountAmount },
        totalFineAmount: { increment: fineAmount },
        totalFeeAmount: { increment: totalIncomingAmount },
      },
      create: {
        studentId,
        totalPaidAmount: amount,
        totalDiscountAmount: discountAmount,
        totalFineAmount: fineAmount,
        totalFeeAmount: totalIncomingAmount,
        totalAbacusAmount: 0,
      },
    });

    // ✅ Step 9: Create transaction (now includes academicYear)
    const newTransaction = await prisma.feeTransaction.create({
      data: {
        studentId,
        term,
        studentFeesId: studentFee.id,
        academicYear, // ✅ included safely
        amount,
        discountAmount,
        fineAmount,
        receiptDate: parsedReceiptDate,
        receiptNo: String(receiptNo || ""),
        paymentMode,
        remarks,
        updatedByName,
      },
    });

    // ✅ Step 10: Log a message
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { Class: true },
    });

    if (student) {
      const messageContent = getMessageContent("FEE_COLLECTION", {
        name: student.name,
        className: student.Class?.name ?? "",
        amount,
        term,
      });

      await prisma.messages.create({
        data: {
          studentId,
          type: "FEE_COLLECTION",
          message: messageContent,
          classId: student.Class?.id ?? null,
          date: new Date(),
        },
      });
    }

    console.log(
      `✅ Fee transaction recorded for ${studentId} (${academicYear}) – ${term}`
    );

    return NextResponse.json(
      {
        message: "✅ Fee updated and transaction recorded successfully.",
        academicYear,
        updatedFee,
        updatedTotalFee,
        transaction: newTransaction,
      },
      { status: 200 }
    );
  } catch (error: any) {
  console.error("❌ API Error:", error);

  if (error.code === "P2002") {
    return NextResponse.json(
      { message: "Duplicate record constraint violation", meta: error.meta },
      { status: 400 }
    );
  }

  if (error.code === "P2003") {
    return NextResponse.json(
      { message: "Foreign key constraint failed", meta: error.meta },
      { status: 400 }
    );
  }

  // 🧩 ADD THIS: to print Prisma validation errors
  if (error.name === "PrismaClientValidationError") {
    console.error("⚠️ Validation Error Details:", error.message);
    return NextResponse.json(
      { message: "Prisma validation error", error: error.message },
      { status: 400 }
    );
  }

  // 🧩 ADD THIS: to print unknown Prisma known errors
  if (error.name === "PrismaClientKnownRequestError") {
    console.error("⚠️ Known Prisma Error:", error.message);
    return NextResponse.json(
      { message: "Prisma known error", error: error.message, meta: error.meta },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "Internal Server Error",
      prismaError: error?.meta || null,
      error: error.message || "Unknown error",
      stack: error.stack,
    },
    { status: 500 }
  );
}
}