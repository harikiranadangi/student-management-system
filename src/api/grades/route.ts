import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure you have prisma.ts inside `lib/`

export async function POST(req: Request) {
    try {
        const { level } = await req.json();
        if (!level) return NextResponse.json({ error: "Grade level is required" }, { status: 400 });

        const newGrade = await prisma.grade.create({ data: { level } });

        return NextResponse.json(newGrade, { status: 201 });
    } catch (error) {
        console.error("Error creating grade:", error);
        return NextResponse.json({ error: "Failed to create grade" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const grades = await prisma.grade.findMany();
        return NextResponse.json(grades);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
    }
}
