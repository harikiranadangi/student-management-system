import prisma from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { studentschema } from '@/lib/formValidationSchemas';
import { toast } from 'react-toastify';
import { StudentStatus } from '@prisma/client';

// Clerk User type alias (avoids import conflict)
const client = await clerkClient();
type ClerkUser = Awaited<ReturnType<typeof client.users.getUser>>;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Step 1: Validate input
    const result = studentschema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
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

    // ✅ Step 2: Generate Student ID
    let id = requestedId;
    if (!id) {
      const lastStudent = await prisma.student.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });

      id = lastStudent?.id
        ? (parseInt(lastStudent.id.toString()) + 1).toString()
        : '10000';
    }

    const generatedUsername = `s${id}`;
    const password = phone;
    const phoneNumber = `+91${phone}`;

    // ✅ Step 3: Find or Create Parent Clerk User
    let parentUser: ClerkUser | null = null;

    // 🔑 Check if parent already exists by phone number
    const existingUsers = await client.users.getUserList({
      phoneNumber: [phoneNumber],
    });

    if (existingUsers.data.length > 0) {
      parentUser = existingUsers.data[0]; // 👈 reuse existing parent
      console.log('Parent user found in Clerk:', parentUser.id);
    } else {
      // 👩‍👩‍👦 If not found, create new parent user in Clerk
      parentUser = await client.users.createUser({
        username: generatedUsername,
        password: password,
        firstName: name,
        phoneNumber: [phoneNumber],
      });

      await client.users.updateUser(parentUser.id, {
        publicMetadata: { role: 'student' },
      });

      console.log('New User created in Clerk:', parentUser.id);
    }

    // ✅ Step 4: Create or reuse Profile
    let profile = await prisma.profile.findUnique({
      where: { clerk_id: parentUser.id },
      include: { users: true, activeUser: true },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          phone,
          clerk_id: parentUser.id,
        },
        include: { users: true, activeUser: true },
      });
      console.log("New Profile created:", profile);
    } else {
      console.log("Existing Profile reused:", profile);
    }

    // ✅ Step 5: Ensure Role (student) exists for this profile
    const existingRole = await prisma.linkedUser.findFirst({
      where: { username: generatedUsername },
    });

    if (existingRole) {
      return NextResponse.json(
        { message: `Student username "${generatedUsername}" already exists!` },
        { status: 409 }
      );
    }

    const role = await prisma.linkedUser.create({
      data: {
        role: "student",
        username: generatedUsername,
        profileId: profile.id, // 🔑 links to profile,
      },
    });
    console.log("New Role created:", role);

    // If profile has no active role yet, set this new role as active
    if (!profile.activeUserId) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { activeUserId: role.id },
      });
      console.log("Active role set for profile:", role.id);
    }


    const existingStudentAccount = await prisma.student.findUnique({
      where: { username: generatedUsername },
    });

    if (existingStudentAccount) {
      return NextResponse.json(
        { message: `Student username "${generatedUsername}" already exists!` },
        { status: 409 }
      );
    }

    // ✅ Step 5: Create Student record linked to parent’s Clerk ID
    console.log('Creating student with ID:', id);
    const studentData: any = {
      id,
      username: generatedUsername,
      name,
      parentName,
      email: email ?? undefined,
      phone,
      address,
      gender,
      img: img ?? undefined,
      bloodType,
      classId,
      academicYear,
      clerk_id: parentUser.id,
      profileId: profile.id,
      linkedUserId: role.id,
    };

    // Only add dob if provided
    if (dob) {
      studentData.dob = new Date(dob);
    }

    const student = await prisma.student.create({
      data: studentData,
    });

    console.log('Student created:', student);



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

    console.log('Fee structures assigned:', matchingFeeStructures);

    return NextResponse.json(student, { status: 201 }); toast.success('Student created successfully!');
  } catch (error: any) {
    console.error('Error details:', JSON.stringify(error, null, 2));

    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Unique constraint failed (probably username exists).' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// ---------------------- GET ----------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const gradeId = searchParams.get("gradeId");
  const gender = searchParams.get("gender");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10); // default 50

  try {
    // Base condition
    const where: any = { status: StudentStatus.ACTIVE };

    if (classId) {
      where.classId = Number(classId);
    }

    if (gender) {
      where.gender = gender;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { parentName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    // ✅ Only add grade filter if provided
    if (gradeId) {
      where.Class = {
        gradeId: Number(gradeId),
      };
    }

    // Pagination offset
    const skip = (page - 1) * limit;

    // Fetch students + count
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: { Class: true },
        orderBy: [{ classId: "asc" }, { gender: "desc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching students:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch students" },
      { status: 500 }
    );
  }
}
