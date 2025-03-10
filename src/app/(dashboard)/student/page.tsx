import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

const StudentPage = async () => {
  const { userId, role } = await fetchUserInfo();

  console.log("User ID:", userId);
  console.log("User Role:", role);

  if (!userId || role !== "student") {
    return <p className="text-center text-red-500">❌ Unauthorized or no user found.</p>;
  }

  // Fetch student using `clerk_id`
  const student = await prisma.student.findUnique({
    where: { clerk_id: userId },
  });

  if (!student) {
    return <p className="text-center text-red-500">⚠️ No student data available.</p>;
  }

  console.log("Student Data:", student);

  // Fetch class using `student.id`
  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: student.id } }, // Now using correct ID
    },
  });

  console.log("classItem:", classItem);

  if (classItem.length === 0) {
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
          <Announcements />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classItem[0]?.name})</h1>
          <BigCalendarContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      <div className="flex flex-col w-full gap-8 xl:w-1/3">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
