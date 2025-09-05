import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Session metadata interface
interface SessionMetadata {
  role?: string;
}

// Response shape
interface UserInfo {
  userId: string | null; // always LinkedUser.id (active role)
  role: string | null;
  students?: { studentId: string; classId: number; name: string }[];
  teacherId?: string;
  classId?: number;
}

// ------------------ Helpers ------------------
async function getStudentInfo(linkedUserId: string) {

  const student = await prisma.student.findUnique({
    where: { linkedUserId },
    select: { id: true, classId: true, name: true },
  });

  if (!student) return [];

  return [
    {
      studentId: student.id,
      classId: student.classId,
      name: student.name,
    },
  ];
}

async function getTeacherInfo(linkedUserId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { linkedUserId },
    select: { id: true },
  });

  if (!teacher) return {};

  const teacherClass = await prisma.class.findUnique({
    where: { supervisorId: teacher.id },
    select: { id: true, name: true },
  });

  return {
    teacherId: teacher.id,
    classId: teacherClass?.id,   // ✅ Now we have the right classId
    className: teacherClass?.name,
  };
}

// ------------------ Main ------------------
export async function fetchUserInfo(): Promise<UserInfo> {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { userId: null, role: null };
    }

    const profile = await prisma.profile.findUnique({
      where: { clerk_id: clerkId },
      select: {
        activeUser: { select: { id: true, role: true } },
      },
    });

    const active = profile?.activeUser;
    if (!active) {
      return { userId: null, role: null };
    }

    // Student
    if (active.role === "student") {
      const students = await getStudentInfo(active.id);

      return {
        userId: active.id,
        role: "student",
        students,
      };
    }

    // Teacher
    if (active.role === "teacher") {
      const teacherInfo = await getTeacherInfo(active.id);

      return {
        userId: active.id,
        role: "teacher",
        ...teacherInfo,
      };
    }

    return { userId: active.id, role: active.role };
  } catch (error) {
    return { userId: null, role: null };
  }
}

// ------------------ Utility: Class lookup ------------------
export const getClassIdForRole = async (
  role: string | null,
  userId: string | null
): Promise<number[]> => {

  if (!userId || !role) return [];

  if (role === "student") {
    const student = await prisma.student.findUnique({
      where: { linkedUserId: userId },
      select: { classId: true },
    });
    return student?.classId ? [student.classId] : [];
  }

  if (role === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: { linkedUserId: userId },
      select: { classId: true },
    });
    return teacher?.classId ? [teacher.classId] : [];
  }

  return [];
};

// ------------------ Utility: Current week start ------------------
export const currentWorkWeek = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);

  const diff = dayOfWeek === 0 ? 1 : 1 - dayOfWeek; // Sunday -> Monday
  startOfWeek.setDate(today.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

// ------------------ Utility: Adjust schedule ------------------
export function adjustScheduleToCurrentWeek(
  data: { start: Date; end: Date; title: string }[]
) {

  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const adjusted = data.map((event) => {
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    const dayOfWeek = originalStart.getDay();

    const start = new Date(startOfWeek);
    const end = new Date(startOfWeek);

    start.setDate(start.getDate() + dayOfWeek);
    start.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);

    end.setDate(end.getDate() + dayOfWeek);
    end.setHours(originalEnd.getHours(), originalEnd.getMinutes(), 0, 0);

    return { title: event.title, start, end };
  });

  return adjusted;
}
