// src/scripts/assignFeesToExistingStudents.ts

import prisma from "@/lib/prisma";


console.log("🚀 Starting fee assignment to existing students...");

async function assignFeesToExistingStudents() {
    try {
        // Fetch all students with their class and grade
        const students = await prisma.student.findMany({
            where: { status: "ACTIVE" },
            include: {
                Class: {
                    include: {
                        Grade: true,
                    },
                },
            },
        });

        console.log(`🎯 Found ${students.length} students.`);

        for (const student of students) {
            const grade = student.Class?.Grade;


            if (!student.classId) {
                console.error(`❌ Student ${student.id} has no class assigned. Skipping.`);
                continue;
            }

            if (!grade) {
                console.error(`❌ Student ${student.id} has no grade assigned through class. Skipping.`);
                continue;
            }

            // Fetch fee structures matching grade and academic year
            const matchingFeeStructures = await prisma.feeStructure.findMany({
                where: {
                    gradeId: grade.id,
                    academicYear: student.academicYear,
                },
            });



            if (matchingFeeStructures.length === 0) {
                console.warn(`⚠️ No fee structures found for grade ${grade.id} and year ${student.academicYear}. Skipping student ${student.id}.`);
                continue;
            }

            // Create student fees for each fee structure
            await prisma.studentFees.createMany({
                data: matchingFeeStructures.map((fee) => ({
                    studentId: student.id,
                    feeStructureId: fee.id,
                    academicYear: student.academicYear,
                    term: fee.term,
                    paidAmount: 0,
                    discountAmount: 0,
                    fineAmount: 0,
                    abacusPaidAmount: 0,
                    receivedDate: undefined,
                    receiptDate: null,
                    paymentMode: "CASH",
                })),
                skipDuplicates: true, // Avoid creating duplicates if already assigned
            });

            console.log(`✅ Fees assigned for student ${student.id}`);
            console.log("Student Fees Created:", matchingFeeStructures);
        }

        console.log("🏁 Fee assignment complete for all students.");
    } catch (error) {
        console.error("❌ Error assigning fees:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
assignFeesToExistingStudents();

// npx tsx scripts/assignFeesToStudents.ts
