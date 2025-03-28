import prisma from "./prisma";

export async function getFeesByGrade(gradeId: number) {
    if (!gradeId) return [];

    try {
        return await prisma.feeStructure.findMany({
            where: { gradeId },
        });
    } catch (error) {
        console.error("Error fetching fees:", error);
        return [];
    }
}
