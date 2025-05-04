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

// Main function to fetch user info (userId and role)
export async function fetchUserInfo(): Promise<{ userId: string | null; role: string | null }> {
  try {
    // Fetch session claims and user ID from the authentication system
    const { sessionClaims, userId } = await auth();

    // Extract role using the helper function
    const role = getRoleFromSession(sessionClaims);

    // Return the user ID and role
    console.log("User Info fetched:", { userId, role });

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


const currentWorkWeek = (): Date => {
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

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfweek = currentWorkWeek();

  return lessons.map((lesson) => {
    if (!lesson.start || !lesson.end) {
      throw new Error(`Lesson start or end date is invalid: ${JSON.stringify(lesson)}`);
    }

    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfweek);
    adjustedStartDate.setDate(startOfweek.getDate() + daysFromMonday);
    
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedStartDate.setHours(lesson.start.getHours(), lesson.start.getMinutes(), lesson.start.getSeconds());
    adjustedEndDate.setHours(lesson.end.getHours(), lesson.end.getMinutes(), lesson.end.getSeconds());

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
