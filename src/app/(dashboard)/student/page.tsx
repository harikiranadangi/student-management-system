// app/student/page.tsx
export const dynamic = "force-dynamic";

import Messages from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

const StudentPage = async () => {
  const { userId, role, students } = await fetchUserInfo();

  // 🔒 Only allow student role
  if (!userId || role !== "student") {
    return (
      <p className="text-center text-red-500">
        ❌ Unauthorized or no student user found.
      </p>
    );
  }

  // Students array should contain the active student
  const student = students?.[0] || null;
  if (!student) {
    return (
      <p className="text-center text-red-500">
        ⚠️ No student data available.
      </p>
    );
  }

  // Fetch student with class relation
  const fullStudent = await prisma.student.findUnique({
    where: { id: student.studentId },
    include: { Class: true },
  });

  if (!fullStudent?.Class) {
    return (
      <div className="flex flex-col gap-4 p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full p-4 bg-white rounded-md">
            <h1 className="text-xl font-semibold">Schedule</h1>
            <p>No schedule available for this student.</p>
          </div>
        </div>
        <div className="flex flex-col w-full gap-8 xl:w-1/3">
          <EventCalendar />
          <Messages />
        </div>
      </div>
    );
  }

  // ✅ Student has a class → render calendar
  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">
            Schedule ({fullStudent.Class.name})
          </h1>
          <BigCalendarContainer type="classId" id={fullStudent.Class.id} />
        </div>
      </div>
      <div className="flex flex-col w-full gap-8 xl:w-1/3">
        <EventCalendar />
        <Messages />
      </div>
    </div>
  );
};

export default StudentPage;
