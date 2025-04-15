import React from "react";
import prisma from "@/lib/prisma";
import { calculateStudentFeeReport } from "@/lib/feeUtils";
import DownloadExcelButton from "./DownloadExcelButton"; // adjust path as needed

const StudentFeesReport = async () => {
  const students = await prisma.student.findMany({
    include: {
      Class: { include: { Grade: true } },
      totalFees: true,
      studentFees: {
        include: {
          feeStructure: true,
        },
      },
    },
  });

  const studentReportData = students.map(calculateStudentFeeReport);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Student Fees Report</h1>

      <div className="mb-4 flex justify-end">
        <DownloadExcelButton data={studentReportData} />
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-LamaSky">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Class</th>
            <th className="border px-4 py-2">Total Fees</th>
            <th className="border px-4 py-2">Paid</th>
            <th className="border px-4 py-2">Discount</th>
            <th className="border px-4 py-2">Due</th>
          </tr>
        </thead>
        <tbody>
          {studentReportData.map((student) => (
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.id}</td>
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.className}</td>
              <td className="border px-4 py-2">{student.totalFees}</td>
              <td className="border px-4 py-2">{student.totalPaidAmount}</td>
              <td className="border px-4 py-2">{student.totalDiscountAmount}</td>
              <td className="border px-4 py-2">{student.dueAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentFeesReport;
