import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const SingleStudentFeePage = async ({ params }: { params: { id?: string } }) => {

  // Await the params to ensure they are resolved before use
  const { id } = await params;

  // Log the student ID
  console.log("Fetching Student ID:", id);

  // Fetch user info and role
  const { role } = await fetchUserInfo();
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      Class: {
        include: {
          Grade: true,
          Teacher: true,
          _count: { select: { lessons: true } },
        },
      },
      feesCollections: {
        include: {
          feesStructure: true,
        },
      },
    },
  });

  // If no student fees, fetch grade-level fees
if (!student?.feesCollections.length) {
  const gradeFees = await prisma.feesStructure.findMany({
    where: { gradeId: student?.Class?.Grade?.id },
  });
  console.log("Student Fees Data:", gradeFees);
}

console.log("Student Fees Data:", student?.feesCollections);


  
  if (!student) {
    console.error("Student not found!");
    return notFound(); // ✅ Redirects to a 404 page
  }

  
  console.log("Fetching Student Fees for ID:", student.id);
  
  
  // ✅ Student exists, proceed
  let fees = student.feesCollections;

  // ✅ If no fees assigned to the student, fetch from their Grade
  if (!fees.length && student.Class?.Grade) {
    console.log("No fees found for student. Fetching from Grade:", student.Class.Grade.id);

    fees = await prisma.feesCollection.findMany({
      where: { gradeId: student.Class.Grade.id },
      include: {
        feesStructure: true,
      },
    });

    console.log("Grade-based Fees:", fees);
  }

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
        <table className="min-w-full border border-collapse border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Term</th>
              <th className="px-4 py-2 border">Total Fees</th>
              <th className="px-4 py-2 border">Paid Amount</th>
              <th className="px-4 py-2 border">Due Date</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {fees.length > 0 ? (
              fees.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.term}</td>
                  <td>₹{fee.feesStructure.totalFees}</td>
                  <td>₹{fee.totalReceivedAmount}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className={fee.status === "Paid" ? "text-green-600" : "text-red-600"}>
                    {fee.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No fees assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
      {/* RIGHT */}
    </div>
  );
};

export default SingleStudentFeePage;
