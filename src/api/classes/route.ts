import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function POST(req: Request) {
    try {
        const { name, gradeId, supervisorId } = await req.json();
        if (!name || !gradeId) return NextResponse.json({ error: "Class name and gradeId are required" }, { status: 400 });

        const newClass = await prisma.class.create({
            data: { name, gradeId, supervisorId }
        });

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error("Error creating class:", error);
        return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const classes = await prisma.class.findMany({ include: { Grade: true } });
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
    }
}
