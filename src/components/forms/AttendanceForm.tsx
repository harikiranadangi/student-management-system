"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { markAttendance } from "@/lib/actions";

const AttendanceForm = ({ setOpen, type, data, relatedData }: any) => {
  const [attendance, setAttendance] = useState(
    relatedData.students.map((student: any) => ({
      studentId: student.id,
      name: student.name,
      status: "Present",
    }))
  );

  // Toggle Absent/Present
  const handleAttendanceChange = (id: number) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.studentId === id
          ? { ...student, status: student.status === "Present" ? "Absent" : "Present" }
          : student
      )
    );
  };

  

  const handleSubmit = async () => {
    try {
      await markAttendance(attendance);
      toast.success("Attendance saved successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to mark attendance!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-3 text-lg font-bold">Mark Attendance</h2>
      <div className="flex flex-col gap-2">
        {attendance.map((student) => (
          <label key={student.studentId} className="flex items-center justify-between p-2 border rounded">
            <span>{student.name}</span>
            <button
              className={`px-4 py-1 rounded ${
                student.status === "Absent" ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
              onClick={() => handleAttendanceChange(student.studentId)}
            >
              {student.status}
            </button>
          </label>
        ))}
      </div>
      <button onClick={handleSubmit} className="px-4 py-2 mt-3 text-white bg-blue-600 rounded">
        Save Attendance
      </button>
    </div>
  );
};

export default AttendanceForm;
