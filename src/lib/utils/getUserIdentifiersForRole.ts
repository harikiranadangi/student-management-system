import prisma from "../prisma";

export const getUserIdentifiersForRole = async (role: string | null, userId: string | null) => {
    if (!userId) return { classId: null, studentId: null };
  
    if (role === "student") {
      const clerkStudent = await prisma.profile.findUnique({
        where: { clerk_id: userId },
        select: { Student: { select: { classId: true, id: true } } },
      });
  
      return {
        classId: clerkStudent?.Student?.classId ?? null,
        studentId: clerkStudent?.Student?.id ?? null,
      };
    }
  
    if (role === "teacher") {
      const clerkTeacher = await prisma.profile.findUnique({
        where: { clerk_id: userId },
        select: { Teacher: { select: { classId: true, id: true } } },
      });
  
      return {
        classId: clerkTeacher?.Teacher?.classId ?? null,
        studentId: null,
      };
    }
  
    return { classId: null, studentId: null };
  };
  