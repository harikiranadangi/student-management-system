import prisma from "./prisma";

export const getMessageCount = async ({
    studentId,
    classId,
}: {
    studentId?: string;
    classId?: number;
}) => {
    const filters = [];

    if (studentId) filters.push({ studentId });
    if (classId) filters.push({ classId });

    return await prisma.messages.count({
        where: {
            type: { in: ["ABSENT", "GENERAL", "ANNOUNCEMENT", "FEE_RELATED"] }, // ✅ filter by multiple types // or another type depending on your enum
            ...(filters.length > 0 ? { OR: filters } : {}), // empty OR → return all
        },
    });
};

