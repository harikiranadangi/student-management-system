import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

const StudentPage = async () => {
  const { userId } = await fetchUserInfo();
  const { role } = await fetchUserInfo();

  console.log("User Id:", userId);
  console.log("User Role:", role);
  

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  console.log("classItem:", classItem);

  // Check if `classItem` is empty
  if (classItem.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4 xl:flex-row">
        {/* LEFT: Schedule */}
        <div className="w-full xl:w-2/3">
          <div className="h-full p-4 bg-white rounded-md">
            <h1 className="text-xl font-semibold">Schedule ({classItem[0]?.name})</h1>
            <p>No schedule available for the user.</p>
          </div>
        </div>
        {/* RIGHT: Additional Information */}
        <div className="flex flex-col w-full gap-8 xl:w-1/3">
          <EventCalendar />
          <Announcements />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT: Schedule */}
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classItem[0]?.name})</h1>
          
          <BigCalendarContainer type="classId" id={classItem[0].id} />
          
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
