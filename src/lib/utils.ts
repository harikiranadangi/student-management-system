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
  console.log("[getStudentInfo] Looking up student with linkedUserId:", linkedUserId);

  const student = await prisma.student.findUnique({
    where: { linkedUserId },
    select: { id: true, classId: true, name: true },
  });

  console.log("[getStudentInfo] Result:", student);

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
  console.log("[getTeacherInfo] Looking up teacher with linkedUserId:", linkedUserId);

  const teacher = await prisma.teacher.findUnique({
    where: { linkedUserId },
    select: { id: true, classId: true },
  });

  console.log("[getTeacherInfo] Result:", teacher);

  return teacher
    ? { teacherId: teacher.id, classId: teacher.classId ?? undefined }
    : {};
}

// ------------------ Main ------------------
export async function fetchUserInfo(): Promise<UserInfo> {
  try {
    const { userId: clerkId } = await auth();
    console.log("[fetchUserInfo] Clerk userId:", clerkId);

    if (!clerkId) {
      console.warn("[fetchUserInfo] No Clerk user found");
      return { userId: null, role: null };
    }

    const profile = await prisma.profile.findUnique({
      where: { clerk_id: clerkId },
      select: {
        activeUser: { select: { id: true, role: true } },
      },
    });

    console.log("[fetchUserInfo] Profile:", profile);

    const active = profile?.activeUser;
    if (!active) {
      console.warn("[fetchUserInfo] No activeUser found in profile");
      return { userId: null, role: null };
    }

    console.log("[fetchUserInfo] Active user:", active);

    // Student
    if (active.role === "student") {
      const students = await getStudentInfo(active.id);
      console.log("[fetchUserInfo] Returning student info:", students);

      return {
        userId: active.id,
        role: "student",
        students,
      };
    }

    // Teacher
    if (active.role === "teacher") {
      const teacherInfo = await getTeacherInfo(active.id);
      console.log("[fetchUserInfo] Returning teacher info:", teacherInfo);

      return {
        userId: active.id,
        role: "teacher",
        ...teacherInfo,
      };
    }

    // Fallback (admin, etc.)
    console.log("[fetchUserInfo] Returning fallback role:", active.role);

    return { userId: active.id, role: active.role };
  } catch (error) {
    console.error("[fetchUserInfo] Error:", error);
    return { userId: null, role: null };
  }
}

// ------------------ Utility: Class lookup ------------------
export const getClassIdForRole = async (
  role: string | null,
  userId: string | null
): Promise<number[]> => {
  console.log("[getClassIdForRole] role:", role, "userId:", userId);

  if (!userId || !role) return [];

  if (role === "student") {
    const student = await prisma.student.findUnique({
      where: { linkedUserId: userId },
      select: { classId: true },
    });
    console.log("[getClassIdForRole] Student classId:", student?.classId);
    return student?.classId ? [student.classId] : [];
  }

  if (role === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: { linkedUserId: userId },
      select: { classId: true },
    });
    console.log("[getClassIdForRole] Teacher classId:", teacher?.classId);
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

  console.log("[currentWorkWeek] Start of current work week:", startOfWeek);

  return startOfWeek;
};

// ------------------ Utility: Adjust schedule ------------------
export function adjustScheduleToCurrentWeek(
  data: { start: Date; end: Date; title: string }[]
) {
  console.log("[adjustScheduleToCurrentWeek] Input events:", data);

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

  console.log("[adjustScheduleToCurrentWeek] Adjusted events:", adjusted);

  return adjusted;
}
