// POST /api/exams/by-date
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { date } = await request.json();

        if (!date) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const exams = await prisma.exam.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                examGradeSubjects: {
                    include: {
                        Grade: true,
                        Subject: true,
                    },
                },
            },
        });

        return NextResponse.json({ exams });
    } catch (error) {
        console.error("[FETCH_EXAMS_FOR_DATE_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
    }
}
