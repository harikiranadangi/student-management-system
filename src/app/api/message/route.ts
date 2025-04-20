// app/api/messages/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, type, date, classId, studentId } = await req.json();

    // Ensure the date is in ISO-8601 format
    const formattedDate = date ? new Date(date).toISOString() : new Date().toISOString();

    // Create the message in the database
    const newMessage = await prisma.messages.create({
      data: {
        message,
        type,
        date: formattedDate,
        Class: {
          connect: { id: classId },
        },
        ...(studentId && {
          Student: {
            connect: { id: studentId },
          },
        }),
      },
    });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ success: false, message: "Failed to create message" }, { status: 500 });
  }
}
