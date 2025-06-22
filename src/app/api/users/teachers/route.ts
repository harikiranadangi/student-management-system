import { User } from '@clerk/backend';
import prisma from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { teacherschema } from '@/lib/formValidationSchemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Step 1: Validate input
    const result = teacherschema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }

    const {
      id: requestedId,  // Ensure this is the id you're receiving
      username,
      password,
      parentName,
      name,
      phone,
      address,
      dob,
      email,
      gender,
      bloodType,
      img,
      subjects,
    } = result.data;

    console.log('Received teacher data:', result.data);

    // ✅ Step 2: Use provided username as id (no auto-generation)
    const generatedUsername = username;  // Using provided username as the id
    const finalPassword = password && password !== "" ? password : phone;
    const phoneNumber = `+91${phone}`;

    // ✅ Step 3: Check if Clerk user already exists
    const client = await clerkClient();
    const existingUsers = await client.users.getUserList({ username: [generatedUsername] });

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
      username: generatedUsername,  // Using username as id
      password: finalPassword,
      firstName: name,
      phoneNumber: [phoneNumber],
    });

    await client.users.updateUser(user.id, {
      publicMetadata: { role: 'teacher' },
    });

    console.log('Clerk user created:', user.id);

    // ✅ Step 5: Create Teacher in Prisma with username as id
    const teacher = await prisma.teacher.create({
      data: {
        id: generatedUsername,  // Using username as the id
        username: generatedUsername,  // This will be the same as id
        name,
        parentName: parentName ?? null,
        dob: dob ? new Date(dob) : new Date(),
        email: email ?? null,
        phone,
        address,
        gender,
        clerk_id: user.id,
        img: img ?? null,
        bloodType: bloodType ?? 'Under Investigation',
      },
    });

    // ✅ Step 6: Create SubjectTeacher entries if subjects exist
    if (subjects && Array.isArray(subjects)) {
      const validSubjects = subjects.filter(
        (sub: any) => sub.subjectId && sub.classId
      );

      if (validSubjects.length > 0) {
        await prisma.subjectTeacher.createMany({
          data: validSubjects.map((sub: any) => ({
            subjectId: sub.subjectId,
            classId: sub.classId,
            teacherId: teacher.id,
          })),
          skipDuplicates: true,
        });
      }
    }

    console.log('Teacher created in database:', teacher);

    // ✅ Step 7: Create ClerkTeachers entry
    const clerkTeacher = await prisma.clerkTeachers.create({
      data: {
        clerk_id: user.id,
        user_id: user.id,
        username: generatedUsername,  // Using username as id
        password: finalPassword,
        full_name: name,
        role: 'teacher',
        teacherId: teacher.id,
        publicMetadata: { role: 'teacher' },
      },
    });

    console.log('Clerk teacher metadata created:', clerkTeacher);

    return NextResponse.json(teacher, { status: 201 });

  } catch (error: any) {
    console.error('Error in teacher creation:', JSON.stringify(error, null, 2));

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
