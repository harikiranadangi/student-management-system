export const dynamic = "force-dynamic";

import Messages from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";

const StudentProfilePage = async () => {
  const { userId } = await fetchUserInfo();
  if (!userId) {
    console.log("❌ No userId found");
    return notFound();
  }

  const student = await prisma.student.findFirst({
    where: { clerk_id: userId },
    include: {
      Class: {
        include: {
          Teacher: true,
          _count: { select: { lessons: true } },
          Grade: {
            include: {
              feestructure: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    console.log("❌ No student found for clerk_id:", userId);
    return notFound();
  }

  // Fee summary fetch with auth + error handling
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");


  const feeRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fees/fee-summary`, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  let totalPaid = 0;
  let totalDue = 0;
  let isFullyPaid = false;

  if (feeRes.ok) {
    const feeData = await feeRes.json();
    totalPaid = feeData.totalPaid;
    totalDue = feeData.totalFees - feeData.totalPaid;
    isFullyPaid = feeData.isFullyPaid;
  } else {
    console.error("❌ Failed to fetch fee summary:", await feeRes.text());
  }

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
                src={student.img || (student.gender === "Male" ? "/male.png" : "/female.png")}
                alt={student.name}
                width={144}
                height={144}
                className="object-cover rounded-full w-24 h-24"
              />
            </div>
            <div className="flex flex-col justify-between w-2/3 gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{student.name}</h1>
              </div>
              <p className="text-sm text-gray-500"></p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/date.png" alt="DOB" width={14} height={14} />
                  <p className="text-sm text-gray-500">
                    {student.dob ? new Intl.DateTimeFormat("en-GB").format(new Date(student.dob)) : "Date of birth not available"}
                  </p>
                </div>
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/phone.png" alt="Phone" width={14} height={14} />
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex flex-wrap justify-between flex-1 gap-4">
            {/* Grade */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{student.id}</h1>
                <span className="text-sm text-gray-400">Adm No.</span>
              </div>
            </div>

            {/* Class */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{student.Class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>

            {/* Attendance Card */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
              <Suspense fallback="loading...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div>

            {/* Fees Summary */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/fees.png" alt="Fees" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className={`text-xl font-semibold ${isFullyPaid ? "text-green-600" : "text-red-500"}`}>
                  ₹{totalDue}
                </h1>
                <span className="text-sm text-gray-400">Fees Due</span>
              </div>
            </div>

          </div>
        </div>

        {/* Schedule Calendar */}
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
              <Link className="p-3 rounded-md bg-LamaYellowLight" href={`/list/homeworks?classId=${student.Class.id}`}>
                Student&apos;s Homeworks
              </Link>
            )}
            <Link className="p-3 rounded-md bg-LamaPurpleLight" href={`/list/teachers?classId=${student.Class.id}`}>
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
        <Messages />
      </div>
    </div>
  );
};

export default StudentProfilePage;
