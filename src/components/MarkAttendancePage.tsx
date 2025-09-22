"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Class, Grade, Student } from "@prisma/client";
import { toast } from "react-toastify";

interface Props {
  role: "admin" | "teacher";
  teacherClassId?: number;
}

export default function MarkAttendancePage({ role, teacherClassId }: Props) {
  const { register, handleSubmit } = useForm();
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(
    role === "teacher" ? teacherClassId ?? null : null
  );
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: boolean }>({});
  const today = new Date().toISOString().split("T")[0];
  const [allMarkedAbsent, setAllMarkedAbsent] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      fetch("/api/grades")
        .then((res) => res.json())
        .then(setGrades);
    }
  }, [role]);

  useEffect(() => {
    if (role === "admin" && selectedGrade) {
      fetch(`/api/classes?gradeId=${selectedGrade}`)
        .then((res) => res.json())
        .then(setClasses);
    }
  }, [role, selectedGrade]);

  const fetchStudents = () => {
    let fetchUrl: string;

    if (role === "teacher" && teacherClassId) {
      fetchUrl = `/api/students?classId=${teacherClassId}`;
    } else if (selectedClass) {
      fetchUrl = `/api/students?classId=${selectedClass}`;
    } else if (selectedGrade) {
      fetchUrl = `/api/students?gradeId=${selectedGrade}`;
    } else {
      fetchUrl = `/api/students`;
    }

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((fetchedStudents: any[]) => {
        setStudents(fetchedStudents);

        const initialStatus: { [key: string]: boolean } = {};
        fetchedStudents.forEach((student) => {
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

      toast("Attendance has been submitted");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast("Error submitting Attendance");
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
      <div className="flex-1 p-4 m-4 mt-0 bg-white dark:bg-gray-900 rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Mark Attendance
        </h2>

        <div className="flex gap-4 w-full">
          {/* Date input */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              Date:
            </label>
            <input
              type="date"
              defaultValue={today}
              {...register("date")}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Grade & Class (admin only) */}
          {role === "admin" && (
            <>
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700 dark:text-gray-300">
                  Grade:
                </label>
                <select
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-gray-700 dark:text-gray-300">
                  Class:
                </label>
                <select
                  onChange={(e) => setSelectedClass(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Get students */}
          <div className="flex items-end">
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white w-full px-3 py-2.5 border rounded-md"
              onClick={fetchStudents}
            >
              Get Students
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 m-4 mt-0 bg-white dark:bg-gray-900 rounded-md">
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
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
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Mark All Absent
              </button>
            )}
          </div>
        )}

        {students.length > 0 && (
          <div>
            <h3 className="font-bold mt-0 text-gray-900 dark:text-gray-100">
              Students: {students.length}
            </h3>
            <div className="max-h-[500px] overflow-y-scroll border rounded p-2 bg-LamaSkyLight dark:bg-gray-800 shadow-inner mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {students.map((student: any) => {
                  const isAbsent = !attendanceStatus[student.id];
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleCheckboxChange(student.id)}
                      className={`p-2 rounded-md shadow hover:scale-110 cursor-pointer transition-transform duration-300 ${
                        isAbsent ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <div className="text-sm font-bold text-white">
                        {student.name} ({student.Class?.name ?? "N/A"})
                      </div>
                      <div className="text-sm text-white mt-1 font-bold">
                        Adm No: {student.id}
                      </div>
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
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md mt-2"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
