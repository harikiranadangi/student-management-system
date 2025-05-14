"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Class, Grade, Student } from "@prisma/client";
import { toast } from "react-toastify";

export default function MarkAttendancePage() {
  const { register, handleSubmit } = useForm();
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: boolean }>({});
  const today = new Date().toISOString().split("T")[0];
  const [allMarkedAbsent, setAllMarkedAbsent] = useState(false);

  useEffect(() => {
    fetch("/api/grades")
      .then((res) => res.json())
      .then(setGrades);
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      fetch(`/api/classes?gradeId=${selectedGrade}`)
        .then((res) => res.json())
        .then(setClasses);
    } else {
      setClasses([]);
    }
  }, [selectedGrade]);

  useEffect(() => {
    // Clear students and status when grade/class changes
    setStudents([]);
    setAttendanceStatus({});
  }, [selectedGrade, selectedClass]);

  const fetchStudents = () => {
    const fetchUrl = selectedClass
      ? `/api/students?classId=${selectedClass}`
      : selectedGrade
        ? `/api/students?gradeId=${selectedGrade}`
        : `/api/students`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((fetchedStudents) => {
        setStudents(fetchedStudents);

        const initialStatus: { [key: string]: boolean } = {};
        fetchedStudents.forEach((student: Student) => {
          initialStatus[student.id] = true;
        });
        setAttendanceStatus(initialStatus);
      });
  };

  const onSubmit = async (data: any) => {
    if (!students.length) {
      alert("No students loaded.");
      return;
    }

    const attendanceData = students.map((student) => ({
      studentId: student.id,
      classId: student.classId,
      date: data.date,
      present: attendanceStatus[student.id] ?? true,
    }));

    try {
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceData),
      });

      if (!res.ok) throw new Error("Failed to mark attendance");

      toast(`Attendance has been submitted`);
      const result = await res.json();
      console.log("Attendance submitted:", result);

      // ✅ Refresh the page after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 500); // Give time for toast to show before reload
    } catch (error) {
      toast(`Error submitting Attendance`);
      console.error("Error submitting attendance:", error);
    }
  };


  const handleCheckboxChange = (studentId: string) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: !prevStatus[studentId],
    }));
  };

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">

      <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
        <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

        {/* Wrap inputs and button in flex to align horizontally */}
        <div className="flex gap-4">
          {/* Date input */}
          <div className="flex-1 space-y-2">
            <label className="block font-semibold">Date:</label>
            <input
              type="date"
              defaultValue={today}
              {...register("date")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Grade dropdown */}
          <div className="flex-1 space-y-2">
            <label className="block font-semibold">Grade:</label>
            <select
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="w-full px-3 py-2.5 border rounded-md"
            >
              <option value="">Select Grade</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.level}
                </option>
              ))}
            </select>
          </div>

          {/* Class dropdown */}
          <div className="flex-1 space-y-2">
            <label className="block font-semibold">Class:</label>
            <select
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              className="w-full px-3 py-2.5 border rounded-md"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="button"
              className="bg-green-500 text-white w-full px-3 py-2.5 border rounded-md"
              onClick={fetchStudents}
            >
              Get Students
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
        {students.length > 0 && (
          <div className="flex justify-end">
            {allMarkedAbsent ? (
              <button
                type="button"
                onClick={() => {
                  const updated: { [key: string]: boolean } = {};
                  students.forEach((student) => {
                    updated[student.id] = true;
                  });
                  setAttendanceStatus(updated);
                  setAllMarkedAbsent(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Mark All Present
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const updated: { [key: string]: boolean } = {};
                  students.forEach((student) => {
                    updated[student.id] = false;
                  });
                  setAttendanceStatus(updated);
                  setAllMarkedAbsent(true);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Mark All Absent
              </button>
            )}
          </div>
        )}


        {students.length > 0 && (
          <div>
            <h3 className="font-bold mt-0">Students</h3>
            <h4 className="mt-2 text-lg font-bold">
              {selectedGrade
                ? grades.find((grade) => grade.id === selectedGrade)?.level || selectedGrade
                : selectedClass
                  ? classes.find((cls) => cls.id === selectedClass)?.name || selectedClass
                  : "All Classes"}
            </h4>
            <div className="max-h-[500px] overflow-y-scroll border rounded p-4 bg-LamaSkyLight shadow-inner mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {students.map((student) => {
                  const isAbsent = !attendanceStatus[student.id];
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleCheckboxChange(student.id)}
                      className={`p-4 rounded-md shadow hover:scale-110 cursor-pointer transition-transform duration-300 ${isAbsent ? "bg-red-500" : "bg-green-500"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white">{student.name}</div>
                        <div className="text-sm text-white">
                          {classes.find((cls) => cls.id === student.classId)?.name}
                        </div>
                      </div>
                      <div className="text-sm text-white mt-1 font-bold">{student.id}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {students.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md mt-2"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </form>
  );

}
