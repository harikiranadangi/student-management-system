import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Centralized interface for session metadata
interface SessionMetadata {
  role?: string;
}

// Helper function to extract the role from session claims
export function getRoleFromSession(sessionClaims: any): string | null {
  return (sessionClaims?.metadata as SessionMetadata)?.role || null;
}

export async function fetchUserInfo(): Promise<{
  userId: string | null;
  role: string | null;
  studentId?: string;
  teacherId?: string;
  classId?: number | string; // Consistent type
}> {
  try {
    const { sessionClaims, userId } = await auth();
    const role = getRoleFromSession(sessionClaims);

    if (!userId || !role) {
      return { userId: null, role: null };
    }

    if (role === "student") {
      const student = await prisma.student.findUnique({
        where: { clerk_id: userId },
      });

      if (!student) {
        console.warn(`No student found for Clerk ID: ${userId}`);
      }

      return {
        userId,
        role,
        studentId: student?.id,
        classId: student?.classId,
      };
    }

    if (role === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { clerk_id: userId },
      });

      if (!teacher) {
        console.warn(`No teacher found for Clerk ID: ${userId}`);
      }

      return {
        userId,
        role,
        teacherId: teacher?.id,
        classId: typeof teacher?.classId === 'number' ? teacher?.classId : undefined,
      };
    }

    return { userId, role };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { userId: null, role: null };
  }
}


export const getClassIdForRole = async (role: string | null, userId: string | null): Promise<number | null> => {
  if (!userId) return null;

  if (role === "student") {
    const student = await prisma.student.findUnique({
      where: { clerk_id: userId },
      select: { classId: true },
    });
    return student?.classId ?? null;
  }

  if (role === "teacher") {
    const clerkTeacher = await prisma.clerkTeachers.findUnique({
      where: { user_id: userId },
      select: { teacher: { select: { classId: true } } },
    });
    return clerkTeacher?.teacher?.classId ? Number(clerkTeacher.teacher.classId) : null;
  }

  return null;
};


export const currentWorkWeek = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfweek = new Date(today);

  if (dayOfWeek === 0) {
    startOfweek.setDate(today.getDate() + 1);
  } else {
    startOfweek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfweek.setHours(0, 0, 0, 0);

  return startOfweek;
};

// lib/utils.ts
export function adjustScheduleToCurrentWeek(data: { start: Date; end: Date; title: string }[]) {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  const currentDay = startOfWeek.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust Sunday to be last
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return data.map((event) => {
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    const dayOfWeek = originalStart.getDay();

    const start = new Date(startOfWeek);
    const end = new Date(startOfWeek);

    start.setDate(start.getDate() + dayOfWeek);
    start.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);

    end.setDate(end.getDate() + dayOfWeek);
    end.setHours(originalEnd.getHours(), originalEnd.getMinutes(), 0, 0);

    return {
      title: event.title,
      start,
      end,
    };
  });
}
