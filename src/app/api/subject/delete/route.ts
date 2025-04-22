import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const data = await req.formData();
    const id = data.get("id")?.toString();

    if (!id) {
        return NextResponse.json({ success: false, error: true, message: "No ID provided" }, { status: 400 });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return NextResponse.json({ success: false, error: true, message: "Invalid ID format" }, { status: 400 });
    }

    try {
        await prisma.subject.delete({ where: { id: parsedId } });
        return NextResponse.json({ success: true, error: false });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ success: false, error: true, message: "Delete failed" }, { status: 500 });
    }
}
