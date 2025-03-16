import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

export default async function ProfilePage() {
  const { userId, role } = await fetchUserInfo();

  if (!userId) {
    return <p className="text-center text-red-500">❌ Unauthorized or no user found.</p>;
  }

  let userData = null;

  if (role === "student") {
    // Fetch clerk_id from clerkStudents
    const clerkUser = await prisma.clerkStudents.findUnique({
      where: { user_id: userId },
      select: { clerk_id: true },
    });

    if (clerkUser) {
      userData = await prisma.student.findUnique({
        where: { clerk_id: clerkUser.clerk_id },
        include: { Class: true }, // Include class relation
      });
    }
  } else if (role === "teacher") {
    // Fetch clerk_id from clerkStudents
    const clerkUser = await prisma.clerkTeachers.findUnique({
      where: { user_id: userId },
      select: { clerk_id: true },
    });
    
    // Fetch teacher details
    userData = await prisma.teacher.findUnique({
      where: { classId: clerkUser?.clerk_id }, // Assuming user_id links to the teacher
    });
  // } else if (role === "admin") {
  //   // Fetch admin details
  //   userData = await prisma.admin.findUnique({
  //     where: { id: userId }, // Assuming id is used for admin lookup
  //   });
   }

  if (!userData) {
    return <p className="text-center text-red-500">❌ User data not found.</p>;
  }

  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p><strong>Name:</strong> {userData.name || userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        {/* {role === "student" && <p><strong>Class:</strong> {userData.classId}</p>} */}
        {role === "teacher" && (<p><strong>Assigned Classes:</strong> {userData.classId}</p>
        )}
        {/* {role === "admin" && <p><strong>Role:</strong> {userData.role}</p>} */}
      </div>
    </div>
  );
}
