import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import according to your project structure
// POST handler for creating a fee transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      term,
      amount,
      discountAmount,
      fineAmount,
      receiptNo,
      paymentMode,
      amountPaid,
    } = body;

    // Ensure all required fields are passed in
    if (!studentId || !term || !amount || !discountAmount || !fineAmount || !receiptNo || !paymentMode || !amountPaid) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Fetch the StudentFees record for the given studentId and term
    const studentFees = await prisma.studentFees.findUnique({
      where: {
        studentId_academicYear_term: {
          studentId: studentId,
          academicYear: "Y2024_2025", // Replace with the correct academic year
          term: term,              // Ensure term is properly passed
        },
      },
    });

    if (!studentFees) {
      return NextResponse.json({ message: 'Student fees record not found' }, { status: 404 });
    }

    // Fetch the Student record for the given studentId
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Create the FeeTransaction and link it to the studentFeesId
    const feeTransaction = await prisma.newFeeTransaction.create({
      data: {
        studentId: studentId,         // Ensure studentId is passed
        term: term,                   // Ensure term is passed
        student: { connect: { id: student.id } },  // Link the student using the ID
        studentFees: { connect: { id: studentFees.id } },  // Link the studentFees using the ID
        amount: amount,
        discountAmount: discountAmount,
        fineAmount: fineAmount,
        receiptDate: new Date(),
        receiptNo: receiptNo,
        paymentMode: paymentMode,
        amountPaid: amountPaid,
      },
    });

    return NextResponse.json(feeTransaction, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating fee transaction' }, { status: 500 });
  }
}
