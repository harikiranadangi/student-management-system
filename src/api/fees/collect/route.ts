import { collectFees } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { studentId, term, amountPaid, discount, fine, paymentMode } = body;

        if (!studentId || !term || !amountPaid || !paymentMode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await collectFees(studentId, term, amountPaid, discount, fine, paymentMode);
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}
