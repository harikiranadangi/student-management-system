export const dynamic = "force-dynamic";
import Messages from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import { Prisma } from "@prisma/client";

const StudentPage = async () => {
  const { userId, role } = await fetchUserInfo();

  console.log("👤 Clerk userId:", userId);
  console.log("👤 User role:", role)
  ;


  if (!userId || role !== "student") {
    return <p className="text-center text-red-500">❌ Unauthorized or no user found.</p>;
  }

  const cleanUserId = userId.replace(/[\s\u200B-\u200D\uFEFF]/g, "");

  // Directly use userId as clerk_id in student table
  const student = await prisma.student.findFirst({
    where: { clerk_id: cleanUserId },
    include: { Class: true },
  });
  console.log("👤 Student data:", student);
  const raw = await prisma.$queryRawUnsafe<
    { id: string; name: string; classId: number; clerk_id: string | null }[]
  >(`SELECT id, name, "classId", clerk_id FROM "Student" WHERE clerk_id = '${userId}'`);

  console.log("RAW query result:", raw);



  if (!student) {
    return <p className="text-center text-red-500">⚠️ No student data available.</p>;
  }

  if (!student.Class) {
    return (
      <div className="flex flex-col gap-4 p-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          <div className="h-full p-4 bg-white rounded-md">
            <h1 className="text-xl font-semibold">Schedule</h1>
            <p>No schedule available for the user.</p>
          </div>
        </div>
        <div className="flex flex-col w-full gap-8 xl:w-1/3">
          <EventCalendar />
          <Messages />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({student.Class.name})</h1>
          <BigCalendarContainer type="classId" id={student.Class.id} />
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
