import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // Extract the `id` from the pathname
    const paramId = req.nextUrl.pathname.split("/")[3];

    const body = await req.json();
    const { message, type, studentId, date, classId } = body;

    // If `date` is not provided, set it to the current date
    const formattedDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const updatedMessage = await prisma.messages.update({
      where: { id: paramId }, // Use the extracted `id` here
      data: {
        message,
        type,
        date: formattedDate,
        ...(classId && {
          Class: {
            connect: { id: classId },
          },
        }),
        ...(studentId && {
          Student: {
            connect: { id: studentId },
          },
        }),
      },
    });

    return NextResponse.json({ success: true, data: updatedMessage }, { status: 200 });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update message" },
      { status: 500 }
    );
  }
}
