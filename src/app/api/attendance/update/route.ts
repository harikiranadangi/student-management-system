import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const { attendanceId, present } = await req.json();

    if (!attendanceId || present === undefined) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    try {
        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendanceId },
            data: { present },
        });

        return NextResponse.json(updatedAttendance);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
    }
}
