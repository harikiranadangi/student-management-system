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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label>Date: </label>
        <input type="date" defaultValue={today} {...register("date")} />
      </div>

      <div>
        <label>Grade: </label>
        <select onChange={(e) => setSelectedGrade(Number(e.target.value))}>
          <option value="">Select Grade</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Class: </label>
        <select onChange={(e) => setSelectedClass(Number(e.target.value))}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="button"
          className="bg-green-500 text-black-500 px-4 py-2 rounded"
          onClick={fetchStudents}
        >
          Get Students
        </button>
      </div>

      {students.length > 0 && (
        <div className="flex gap-4 my-4">
          {allMarkedAbsent ? (
            <button
              type="button"
              onClick={() => {
                const updated: { [key: string]: boolean } = {};
                students.forEach((student) => {
                  updated[student.id] = true; // Set all students to present
                });
                setAttendanceStatus(updated);
                setAllMarkedAbsent(false); // Toggle state to show "Mark All Absent" next
              }}
              className="bg-green-500 text-black-500 px-3 py-1 rounded"
            >
              Mark All Present
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const updated: { [key: string]: boolean } = {};
                students.forEach((student) => {
                  updated[student.id] = false; // Set all students to absent
                });
                setAttendanceStatus(updated);
                setAllMarkedAbsent(true); // Toggle state to show "Mark All Present" next
              }}
              className="bg-red-500 text-black-500 px-3 py-1 rounded"
            >
              Mark All Absent
            </button>
          )}
        </div>
      )}



      {students.length > 0 && (
        <div>
          <h3 className="font-bold mt-4">Students</h3>
          <h3 className="mt-2 text-l text-black font-bold">
            {selectedGrade
              ? grades.find((grade) => grade.id === selectedGrade)?.level || "Unknown Grade"
              : selectedClass
                ? classes.find((cls) => cls.id === selectedClass)?.name || "Unknown Class"
                : "All Classes"}
          </h3>
          <div className="max-h-[530px] overflow-y-scroll border rounded p-2 bg-white shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">

              {students.map((student) => {
                const isAbsent = !attendanceStatus[student.id];
                return (
                  <div
                    key={student.id}
                    onClick={() => handleCheckboxChange(student.id)}
                    className={`p-2 rounded shadow hover:scale-105 cursor-pointer transition-transform duration-200 ${isAbsent ? "bg-red-500" : "bg-green-500"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white">{student.name}</div>
                      <div className="text-sm text-white">
                        {classes.find((cls) => cls.id === student.classId)?.name }
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Attendance
        </button>
      )}
    </form>
  );
}
