import { NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is imported

export async function GET(
    req: NextRequest,
    context: { params: { id?: string } } // ✅ Correctly define `params`
) {
    const { id } = context.params; // ✅ Correct way to access `id`

    if (!id) {
        return new Response(JSON.stringify({ error: "Student ID is required" }), { status: 400 });
    }

    try {
        console.log("API Request Received:", { studentId: id });

        // 1️⃣ Fetch student details with Class & Grade
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                Class: { include: { Grade: true } },
                studentFees: true
            }, // Include student fees for payment status
        });

        console.log("Student Details:", student); // Debugging output

        if (!student) {
            return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
        }

        const gradeId = student.Class.Grade.id;

        // 2️⃣ Fetch grade-wise fees
        const gradeFees = await prisma.feeStructure.findMany({
            where: { gradeId },
        });

        console.log("Feestructure Details:", gradeFees); // Debugging output

        // 3️⃣ Fetch student payments
        const studentPayments = await prisma.studentFees.findMany({
            where: { studentId: id },
        }); 

        console.log("studentPayments Details:", studentPayments); // Debugging output

        // 4️⃣ Merge fee data with payment status
        const feesWithStatus = gradeFees.map((fee) => {
            const payment = studentPayments.find((p) => p.term === fee.term);

            return {
                studentId: id,
                studentName: `${student.name}`,
                studentClass: student.Class.name,
                term: fee.term,
                amount: fee.termFees ?? 0,
                startDate: fee.startDate ?? null,
                dueDate: fee.dueDate ?? null,
                abacusFees: fee.abacusFees ?? 0,
                paid: !!payment,
                paidDate: payment?.receiptDate || null,
                discount: payment?.discountAmount || 0,
                fine: payment?.fineAmount || 0,
            };
        });

        return new Response(JSON.stringify(feesWithStatus), { status: 200 });
    } catch (error) {
        console.error("Error fetching fees:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch fees" }), { status: 500 });
    }
}
