import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const StudentProfilePage = async () => {
  const { userId } = await fetchUserInfo();
  if (!userId) return notFound(); // Redirect if not logged in

  // Step 1: Fetch clerk_id from ClerkStudents using user_id
  const clerkUser = await prisma.clerkStudents.findUnique({
    where: { user_id: userId },
    select: { clerk_id: true },
  });

  if (!clerkUser) return notFound(); // Redirect if Clerk user is not found

  // Step 2: Fetch student using clerk_id
  const student = await prisma.student.findUnique({
    where: { clerk_id: userId },
    include: {
      Class: {
        include: {
          Teacher: true,
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  if (!student) return notFound(); // Redirect if student is not found

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
                  src={student.img || "/student.png"}
                  alt=""
                  width={144}
                  height={144}
                  className="object-cover rounded-full w-36 h-36"
                />
              </div>
              <div className="flex flex-col justify-between w-2/3 gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold">{student.name}</h1>
  
                </div>
                <p className="text-sm text-gray-500">
  
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                  <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                    <span>{student.bloodType}</span>
                  </div>
                  <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <p className="text-sm text-gray-500">
                      {student.dob ? new Intl.DateTimeFormat("en-GB").format(new Date(student.dob)) : "Date of birth not available"}
                    </p>
                  </div>
                  <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span>{student.email || "-"}</span>
                  </div>
                  <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span>{student.phone || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* SMALL CARDS */}
            <div className="flex flex-wrap justify-between flex-1 gap-4">
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleAttendance.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <Suspense fallback="loading...">
                  <StudentAttendanceCard id={student.id} />
                </Suspense>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{student.Class.gradeId}</h1>
                  <span className="text-sm text-gray-400">Grade</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{student.Class._count.lessons}</h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{student.Class.name}</h1>
                  <span className="text-sm text-gray-400">Class</span>
                </div>
              </div>
            </div>
          </div>
          {/* BOTTOM */}
          <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
            <h1>Student&apos;s Schedule</h1>
            <BigCalendarContainer type="classId" id={student.Class.id} />
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex flex-col w-full gap-4 xl:w-1/3">
          <div className="p-4 bg-white rounded-md">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
              {student.Class.id && (
                <Link
                  className="p-3 rounded-md bg-LamaYellowLight"
                  href={`/list/homeworks?classId=${student.Class.id}`}>
                  Student&apos;s Homeworks
                </Link>
              )}
  
              <Link className="p-3 rounded-md bg-LamaPurpleLight" href={`/list/teachers?classId=${(student.Class.id.toString())}`}>
                Student&apos;s Teachers
              </Link>
              <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${student.Class.id}`}>
                Student&apos;s Exams
              </Link>
              <Link className="p-3 rounded-md bg-LamaSkyLight" href={`/list/assignments?classId=${student.Class.id}`}>
                Student&apos;s Assignments
              </Link>
              <Link className="p-3 rounded-md bg-LamaYellowLight" href={`/list/results?studentId=${student.id}`}>
                Student&apos;s Results
              </Link>
              <Link className="p-3 rounded-md bg-LamaPurpleLight" href={`/list/lessons?classId=${student.Class.id}`}>
                Student&apos;s Lessons
              </Link>
            </div>
          </div>
          <Performance />
          <Announcements />
        </div>
      </div>
    );
  };
  
export default StudentProfilePage;
