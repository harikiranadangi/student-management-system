import prisma from "../prisma";

export const getUserIdentifiersForRole = async (role: string | null, userId: string | null) => {
    if (!userId) return { classId: null, studentId: null };
  
    if (role === "student") {
      const clerkStudent = await prisma.clerkStudents.findUnique({
        where: { user_id: userId },
        select: { student: { select: { classId: true, id: true } } },
      });
  
      return {
        classId: clerkStudent?.student?.classId ?? null,
        studentId: clerkStudent?.student?.id ?? null,
      };
    }
  
    if (role === "teacher") {
      const clerkTeacher = await prisma.clerkTeachers.findUnique({
        where: { user_id: userId },
        select: { teacher: { select: { classId: true, id: true } } },
      });
  
      return {
        classId: clerkTeacher?.teacher?.classId ?? null,
        studentId: null,
      };
    }
  
    return { classId: null, studentId: null };
  };
  