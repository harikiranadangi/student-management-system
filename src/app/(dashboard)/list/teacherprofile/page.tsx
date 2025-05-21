export const dynamic = "force-dynamic";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const TeacherProfilePage = async () => {
  const { userId, role, teacherId } = await fetchUserInfo();
  if (!userId) return notFound(); // Redirect if not logged in

  if (!teacherId) {
    console.log("❌ No teacherId found");
    return notFound();
  }

  const teacher = await prisma.teacher.findUnique({
    where: { clerk_id: userId }, // Use the retrieved clerk_id
    include: {
      class: { // ✅ Fetch the teacher's single assigned class
        select: {
          id: true,
          name: true,
          _count: { select: { students: true } }, // ✅ Get student count in the class
        },
      },
      _count: {
        select: {
          subjects: true,
          lessons: true,
        },
      },
    },
  });

  // Step 2: If clerkUser exists, fetch the student using clerk_id
  if (!teacher) {
    throw new Error("Clerk user not found");
  }

  // ✅ Get student count from the assigned class
  const totalStudents = teacher.class?._count?.students ?? 0;
  const teacherImage = teacher.img || (teacher.gender === "Male" ? "/maleteacher.png" : "/femaleteacher.png");



  // Return the student data
  return (
    <div className="flex flex-col flex-1 gap-4 p-4 xl:flex-row">

      {/* LEFT */}
      <div className="w-full xl:w-2/3">

        {/* TOP */}
        <div className="flex flex-col gap-4 lg:flex-row">

          {/* USER INFO CARD */}
          <div className="flex flex-1 gap-4 px-4 py-6 rounded-md bg-LamaSky">
            <div className="w-1/3">
              <Image
                src={teacherImage}
                alt={teacher.name}
                width={144}
                height={144}
                className="object-cover rounded-full w-36 h-36"
              />
            </div>

            <div className="flex flex-col justify-between w-2/3 gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {teacher.name}
                </h1>
                {role === "admin" && <FormContainer table="teacher" type="update" data={teacher} />}
              </div>

              <p className="text-sm text-black-500"></p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">

                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>

                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <p className="text-sm text-gray-500">
                    {teacher.dob
                      ? new Intl.DateTimeFormat("en-GB").format(teacher.dob)
                      : "Date of birth not available"}
                  </p>
                </div>

                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>

                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  {/* <span>{teacher.phone}</span> */}
                </div>

              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex flex-wrap justify-between flex-1 gap-4">

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{teacher.class?.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{totalStudents}</h1>
                <span className="text-sm text-gray-400">Students</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{teacher._count.subjects}</h1>
                <span className="text-sm text-gray-400">Subjects</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{teacher._count.lessons}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 flex flex-col bg-white rounded-md p-4 h-[800px] w-full">
          <h1 className="mb-4">Teacher&apos;s Schedule</h1>
          <div className="flex-1 overflow-hidden w-full">
            <BigCalendarContainer type="teacherId" id={teacher.id} />
          </div>
        </div>



      </div>
      {/* RIGHT */}
      <div className="flex flex-col w-full gap-4 xl:w-1/3">
        <div className="p-4 bg-white rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="flex flex-wrap gap-4 mt-9 text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-LamaSkyLight" href={`/list/classes?supervisorId=${teacher.id}`}>
              Teacher&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-LamaPurpleLight"
              href={`/list/users/students?teacherId=${teacher.id}`}>
              Teacher&apos;s Students
            </Link>

            <Link className="p-3 rounded-md bg-LamaYellowLight" href={`/list/lessons?teacherId=${teacher.id}`}>
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?teacherId=${teacher.id}`}>
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-LamaSkyLight" href={`/list/assignments?teacherId=${teacher.id}`}>
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TeacherProfilePage;
