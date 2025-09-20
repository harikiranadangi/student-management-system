// app/teacher/page.tsx
export const dynamic = "force-dynamic";

import Messages from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import TeacherTimetableContainer from "@/components/TeacherTimetableContainer";
import UnauthorizedReload from "@/components/UnauthorizedReload";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils/server-utils";

const TeacherPage = async () => {
  const { userId, role, teacherId } = await fetchUserInfo();

  // 🔒 Only allow teacher role
  if (!userId || role !== "teacher") {
    return <UnauthorizedReload />;
  }

  // Fetch teacher with class relation
  const fullTeacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { class: true },
  });

  if (!fullTeacher?.class) {
    return (
      <div className="flex flex-col gap-4 p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full p-4 bg-white rounded-md">
            <h1 className="text-xl font-semibold">Schedule</h1>
            <p>No schedule available for this teacher.</p>
          </div>
        </div>
        <div className="flex flex-col w-full gap-8 xl:w-1/3">
          <EventCalendar />
          <Messages />
        </div>
      </div>
    );
  }

  // ✅ Teacher has a class → render calendar
  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">
            Schedule ({fullTeacher.class.name})
          </h1>
          <TeacherTimetableContainer teacherId={fullTeacher.id} />
        </div>
      </div>
      <div className="flex flex-col w-full gap-8 xl:w-1/3">
        <EventCalendar />
        <Messages />
      </div>
    </div>
  );
};

export default TeacherPage;
