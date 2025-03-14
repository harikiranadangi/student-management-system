import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import {  Prisma } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

type AttendanceEntry = {
  studentId: string;
  studentName: string;
  status: "Present" | "Absent"; // Default: Present
};

type AttendanceList = {
  classId: string;
  className: string;
  students: AttendanceEntry[];
};

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceEntry[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  // Fetch available classes
  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  // Fetch students when class is selected
  const fetchStudents = async (classId: string) => {
    setSelectedClass(classId);
    const response = await fetch(`/api/students?classId=${classId}`);
    const students = await response.json();

    // Initialize with default "Present" status
    const initialAttendance = students.map((student: { id: string; name: string }) => ({
      studentId: student.id,
      studentName: student.name,
      status: "Present",
    }));

    setAttendanceList(initialAttendance);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Mark Attendance</h1>

      {/* Class Selection Dropdown */}
      <select
        className="w-full p-2 my-4 border"
        onChange={(e) => fetchStudents(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      {/* Attendance List Table */}
      {attendanceList.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Student Name</th>
              <th className="p-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((student) => (
              <tr key={student.studentId} className="border-b">
                <td className="p-2">{student.studentName}</td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      setAttendanceList((prev) =>
                        prev.map((entry) =>
                          entry.studentId === student.studentId
                            ? { ...entry, status: entry.status === "Present" ? "Absent" : "Present" }
                            : entry
                        )
                      )
                    }
                    className={`px-4 py-1 rounded ${
                      student.status === "Present" ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {student.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Submit Button */}
      {attendanceList.length > 0 && (
        <button
          onClick={() =>
            fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ classId: selectedClass, attendanceRecords: attendanceList }),
            }).then(() => alert("Attendance saved!"))
          }
          className="px-4 py-2 mt-4 text-white bg-blue-500"
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
};

export default AttendancePage;