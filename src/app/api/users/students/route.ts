import prisma from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Step 1: Parse request body
    const body = await req.json();
    const {
      id,
      name,
      username,
      phone,
      classId,
      academicYear,
      dob,
      email,
      gender,
      parentName,
      bloodType,
      address,
      img,
    } = body;

    console.log('Received data:', body);

    // Step 2: Clerk client & check if user exists
    const client = await clerkClient();
    const existingUsers = await client.users.getUserList({ query: username });

    if (existingUsers.totalCount > 0) {
      return NextResponse.json(
        { message: `Username "${username}" already exists!` },
        { status: 409 }
      );
    }

    const password = phone

    // Step 2: Create Clerk user
    const user = await client.users.createUser({
      username: username,
      password,
      firstName: name,
      lastName: "",
    });

    await client.users.updateUser(user.id, {
      publicMetadata: {
        role: "student"
      }
    });
    

    console.log('Created Clerk User:', user.firstName, user.username, user.id);


    // Step 3: Create student in Prisma
    const student = await prisma.student.create({
      data: {
        id,
        username,
        name,
        parentName,
        dob: new Date(dob),
        email,
        phone,
        address,
        gender,
        img,
        bloodType,
        classId,
        academicYear,
        clerk_id: user.id,
      },
    });

    console.log('Student Created:', student);

    const role = 'student'

    // Step 5: Create ClerkStudent relation
    const clerkStudent = await prisma.clerkStudents.create({
      data: {
        clerk_id: user.id,
        username: `s${student.id}`,
        password: student.id,
        full_name: `${name}`,
        user_id: user.id, // ✅ ADD COMMA HERE
        role,
        studentId: student.id,
      },
    });

    
    console.log('ClerkStudent Created:', clerkStudent);

    // Step 6: Fetch gradeId via class relation
    const studentClass = await prisma.class.findUnique({
      where: { id: student.classId },
      select: { gradeId: true },
    });

    if (!studentClass) {
      return NextResponse.json(
        { message: 'Class not found for the student.' },
        { status: 404 }
      );
    }

    // Step 7: Fetch matching fee structures
    const matchingFeeStructures = await prisma.feeStructure.findMany({
      where: {
        gradeId: studentClass.gradeId,
        academicYear: student.academicYear,
      },
    });

    console.log('Matching Fee Structures:', matchingFeeStructures);

    // Step 8: Map and create student fee records
    if (matchingFeeStructures.length > 0) {
      await prisma.studentFees.createMany({
        data: matchingFeeStructures.map((fee) => ({
          studentId: student.id,
          feeStructureId: fee.id,
          academicYear: academicYear,
          term: fee.term, // ✅ uses enum Term directly
          paidAmount: 0,
          discountAmount: 0,
          fineAmount: 0,
          abacusPaidAmount: 0,
          receivedDate: null,
          receiptDate: new Date(),
          paymentMode: 'CASH',
        })),
      });

      console.log('Student Fees Created.');
    }

    return NextResponse.json(student, { status: 201 });

  } catch (error: any) {
    console.error('Error creating student:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Username already exists in the system.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
