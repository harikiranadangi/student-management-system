import prisma from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { adminSchema } from '@/lib/formValidationSchemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = adminSchema.parse(body);

    const client = await clerkClient();

    // ✅ Step 1: Check if a Clerk user already exists for this phone
    const phoneNumber = `+91${data.phone}`;
    let clerkUser;
    const existingUsers = await client.users.getUserList({ phoneNumber: [phoneNumber] });

    if (existingUsers.data.length > 0) {
      clerkUser = existingUsers.data[0];
      console.log('Existing Clerk user found:', clerkUser.id);
    } else {
      // ✅ Create a new Clerk user
      clerkUser = await client.users.createUser({
        firstName: data.name,
        username: data.username,
        password: data.password,
        phoneNumber: [`+91${data.phone}`],
      });

      console.log('New Clerk user created:', clerkUser.id);
    }

    await client.users.updateUser(clerkUser.id, {
      publicMetadata: { role: 'admin' },
    });

    // ✅ Step 2: Find or create profile
    let profile = await prisma.profile.findFirst({
      where: { phone: data.phone },
      include: { users: true },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          phone: data.phone,
          clerk_id: clerkUser.id,
        },
        include: { users: true },
      });
      console.log('New profile created:', profile);
    } else {
      console.log('Existing profile reused:', profile);
    }

    // ✅ Step 3: Check if username already exists for a role
    const existingRole = await prisma.linkedUser.findFirst({
      where: { username: data.username },
    });

    if (existingRole) {
      return NextResponse.json(
        { message: `Role username "${data.username}" already exists!` },
        { status: 409 }
      );
    }

    // ✅ Step 4: Create new admin role
    const role = await prisma.linkedUser.create({
      data: {
        role: 'admin',
        username: data.username,
        profileId: profile.id,
      },
    });
    console.log('New role created:', role);

    // ✅ Step 5: Create admin record
    const admin = await prisma.admin.create({
      data: {
        username: data.username,
        name: data.name,
        password: data.password,
        parentName: data.parentName ?? null,
        gender: data.gender,
        email: data.email ?? null,
        address: data.address,
        bloodType: data.bloodType ?? null,
        dob: data.dob ?? null,
        img: data.img ?? null,
        phone: data.phone,
        clerk_id: clerkUser.id,
        // ✅ This connects admin <-> linkedUser
        profile: {
          connect: { id: profile.id },
        },
        // ✅ This connects admin <-> linkedUser
        linkedUser: {
          connect: { id: role.id },
        },
      },
    });

    return NextResponse.json({ success: true, admin }, { status: 201 });
  } catch (error: any) {
    console.error('Admin creation error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
