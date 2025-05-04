// src/app/(dashboard)/list/fees/[mode]/[id]/page.tsx

import FeesTableContainer from "@/components/FeesTableContainer";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Define the prop types with `Promise` for `params`
interface StudentFeePageProps {
  params: Promise<{ mode: string; id: string }>;
}

const StudentFeePage = async ({ params }: StudentFeePageProps) => {
  // Await the params promise
  const { mode, id } = await params;

  // Validate the mode parameter
  if (mode !== "collect" && mode !== "cancel") {
    notFound();
  }

  // Fetch student data using Prisma
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      Class: {
        include: {
          Teacher: true,
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  // If no student is found, return a "not found" page
  if (!student) {
    return notFound();
  }

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full">
        {/* TOP */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* USER INFO CARD */}
          <div className="flex flex-1 gap-4 px-4 py-6 rounded-md bg-LamaSky">
            <div className="w-1/3">
              <Image
                src={student.img || "/student.png"}
                alt="Student Image"
                width={144}
                height={144}
                className="object-cover rounded-full w-36 h-36"
              />
            </div>

            <div className="flex flex-col justify-between w-2/3 gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{student.name}</h1>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/date.png" alt="DOB" width={14} height={14} />
                  <p className="text-sm text-gray-500">
                    {student.dob
                      ? new Intl.DateTimeFormat("en-GB").format(new Date(student.dob))
                      : "Date of birth not available"}
                  </p>
                </div>
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/phone.png" alt="Phone" width={14} height={14} />
                  {/* <span>{student.phone || "-"}</span> */}
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex flex-wrap justify-between flex-1 gap-4">

            {/* Grade */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="Grade" width={24} height={24} />
              <div>
                <h1 className="text-xl font-semibold">{student.Class.gradeId}</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>

            {/* Class */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="Class" width={24} height={24} />
              <div>
                <h1 className="text-xl font-semibold">{student.Class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>

            {/* Admission No */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="Admission No" width={24} height={24} />
              <div>
                <h1 className="text-xl font-semibold">{student.id}</h1>
                <span className="text-sm text-gray-400">Admission No</span>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="Attendance" width={24} height={24} />
              <Suspense fallback="Loading attendance...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <FeesTableContainer studentId={student.id} mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default StudentFeePage;
