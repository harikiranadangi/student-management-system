import { User } from '@clerk/backend';
import prisma from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { studentschema } from '@/lib/formValidationSchemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Step 1: Validate input
    const result = studentschema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }

    const {
      id: requestedId,
      name,
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
    } = result.data;

    console.log('Received data:', result.data);

    // ✅ Step 2: Determine ID
    let id = requestedId;
    if (!id) {
      const lastStudent = await prisma.student.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });

      console.log('Last Student:', lastStudent);

      id = lastStudent?.id
        ? (parseInt(lastStudent.id.toString()) + 1).toString()
        : '10000';
    }


    const generatedUsername = `s${id}`;
    const password = phone;
    const phoneNumber = `+91${phone}`;

    // ✅ Step 3: Check if Clerk user already exists
    const client = await clerkClient();
    const existingUsers = await client.users.getUserList({ username: [generatedUsername] });

    console.log('Existing users:', existingUsers);
    const userExists = existingUsers.data.some(
      (u) => u.username === generatedUsername
    );


    if (userExists) {
      return NextResponse.json(
        { message: `Username "${generatedUsername}" already exists!` },
        { status: 409 }
      );
    }

    // ✅ Step 4: Create Clerk user
    const user = await client.users.createUser({
      username: generatedUsername,
      password: password,
      firstName: name,
      phoneNumber: [phoneNumber],
    });

    await client.users.updateUser(user.id, {
      publicMetadata: { role: 'student' },
    });

    console.log('Clerk user created:', user.id, user.username, user.firstName);

    // ✅ Step 5: Create student record
    const student = await prisma.student.create({
      data: {
        id,
        username: generatedUsername,
        name,
        parentName,
        dob: dob ? new Date(dob) : "",  // Ensure dob is either a Date or null
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

    console.log('Student created:', student);


    // ✅ Step 6: Create ClerkStudents entry
    const clerkStudent = await prisma.clerkStudents.create({
      data: {
        clerk_id: user.id,
        username: generatedUsername,
        password: generatedUsername,
        full_name: name,
        user_id: user.id,
        role: 'student',
        studentId: student.id,
      },
    });

    console.log('Clerk student created:', clerkStudent);

    // ✅ Step 7: Get gradeId from class
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

    // ✅ Step 8: Match and assign fee structures
    const matchingFeeStructures = await prisma.feeStructure.findMany({
      where: {
        gradeId: studentClass.gradeId,
        academicYear: student.academicYear,
      },
    });

    if (matchingFeeStructures.length > 0) {
      await prisma.studentFees.createMany({
        data: matchingFeeStructures.map((fee) => ({
          studentId: student.id,
          feeStructureId: fee.id,
          academicYear,
          term: fee.term,
          paidAmount: 0,
          discountAmount: 0,
          fineAmount: 0,
          abacusPaidAmount: 0,
          receivedDate: null,
          receiptDate: new Date(),
          paymentMode: 'CASH',
        })),
      });
    }

    console.log('Fee structures assigned to student:', matchingFeeStructures);

    return NextResponse.json(student, { status: 201 });

  } catch (error: any) {
    console.error('Error details:', JSON.stringify(error, null, 2));

    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Username already exists in the system.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
