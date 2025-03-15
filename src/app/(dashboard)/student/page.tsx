import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

const StudentPage = async () => {
  const { userId, role } = await fetchUserInfo();


  if (!userId || role !== "student") {
    return <p className="text-center text-red-500">❌ Unauthorized or no user found.</p>;
  }

  // Step 1: Fetch clerk_id from clerkUser using user_id
  const clerkUser = await prisma.clerkUser.findUnique({
    where: { user_id: userId }, // userId is provided
    select: { clerk_id: true }, // Only fetch clerk_id
  });

  // Step 2: If clerkUser exists, fetch the student using clerk_id
  if (!clerkUser) {
    throw new Error("Clerk user not found");
  }

  const student = await prisma.student.findUnique({
    where: { clerk_id: clerkUser.clerk_id }, // Use the retrieved clerk_id
    include: { Class: true }, // Include class relation
  });


  if (!student) {
    return <p className="text-center text-red-500">⚠️ No student data available.</p>;
  }


  console.log("Student Data:", student);
  console.log("Class Data from Student:", student?.Class);

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
          <Announcements />
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
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;

