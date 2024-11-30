import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = await auth();

  console.log("userId:", userId);

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  console.log("classItem:", classItem);

  // Handle case where no classes are found
  if (!classItem || classItem.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-semibold text-gray-700">No classes found.</h1>
        <p className="text-gray-500">It seems you are not enrolled in any class.</p>
      </div>
    );
  }

  const classId = classItem[0]?.id;

  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-semibold text-gray-700">Error retrieving class schedule.</h1>
        <p className="text-gray-500">Please contact the administrator.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT: Schedule */}
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classItem[0].name || "Unknown"})</h1>
          <BigCalendarContainer type="class" id={classId} />
        </div>
      </div>
      {/* RIGHT: Additional Information */}
      <div className="flex flex-col w-full gap-8 xl:w-1/3">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
