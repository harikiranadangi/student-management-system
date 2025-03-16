import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

const TeacherPage = async () => {
  
  const { userId, role } = await fetchUserInfo();

  if (!userId || role !== "teacher") {
    return <p className="text-center text-red-500">❌ Unauthorized or no user found.</p>;
  }

  // Step 1: Fetch clerk_id from clerkUser using user_id
  const clerkUser = await prisma.clerkTeachers.findUnique({
    where: { user_id: userId }, // userId is provided
    select: { clerk_id: true }, // Only fetch clerk_id
  });

  // Step 2: If clerkUser exists, fetch the student using clerk_id
  if (!clerkUser) {
    throw new Error("Clerk user not found");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { clerk_id: clerkUser.clerk_id }, // Use the retrieved clerk_id
    include: { class: true }, // Include class relation
  });

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 xl:flex-row">
      {/* LEFT: Description */}
      <div className='w-full xl:w-2/3'>
        <div className='h-full p-4 bg-white rounded-md'>
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!}/>
        </div>
      </div>
      {/* RIGHT: Description */}
        <div className='flex flex-col w-full gap-8 xl:w-1/3'>
        <Announcements />
        </div>
    </div>
  );
};

export default TeacherPage;