"use client";
import { useEffect, useState } from "react";
import { Student, Attendance, Class as SchoolClass, Grade } from "@prisma/client";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type AttendanceResponse = {
  attendance: Attendance[];
  students: (Student & { Class: SchoolClass })[];
};

interface Props {
  role: "admin" | "teacher";
  teacherClassId?: number;
}

export default function ViewAttendancePage({ role, teacherClassId }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [records, setRecords] = useState<AttendanceResponse>({
    attendance: [],
    students: [],
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | number>("");
  const [selectedClass, setSelectedClass] = useState<string | number>(
    role === "teacher" && teacherClassId ? teacherClassId : ""
  );

  const [filterStatus, setFilterStatus] = useState<"all" | "present" | "absent">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAttendance = async () => {
    let url = `/api/attendance/range?from=${from}&to=${to}`;
    if (role === "admin") {
      if (selectedGrade) url += `&gradeId=${selectedGrade}`;
      if (selectedClass) url += `&classId=${selectedClass}`;
    } else if (role === "teacher" && teacherClassId) {
      url += `&classId=${teacherClassId}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    const fetchGradesAndClasses = async () => {
      if (role === "admin") {
        const gradeRes = await fetch("/api/grades");
        const gradeData = await gradeRes.json();
        setGrades(gradeData);

        if (selectedGrade) {
          const classRes = await fetch(`/api/classes?gradeId=${selectedGrade}`);
          const classData = await classRes.json();
          setClasses(classData);
        } else {
          setClasses([]);
        }
      } else if (role === "teacher" && teacherClassId) {
        const classRes = await fetch(`/api/classes?id=${teacherClassId}`);
        const classData = await classRes.json();
        setClasses(classData);
      }
    };

    fetchGradesAndClasses();
  }, [selectedGrade, role, teacherClassId]);

  const updateAttendance = async (attendanceId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const res = await fetch(`/api/attendance/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceId, present: newStatus }),
    });

    if (res.ok) {
      setRecords((prev) => ({
        ...prev,
        attendance: prev.attendance.map((a) =>
          a.id === attendanceId ? { ...a, present: newStatus } : a
        ),
      }));
    } else {
      console.error("Failed to update attendance");
    }
  };

  const filteredAttendance = records.attendance.filter((a) => {
    const student = records.students.find((s) => s.id === a.studentId);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "present" && a.present) ||
      (filterStatus === "absent" && !a.present);
    const matchesSearch =
      !searchQuery ||
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.id.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    const uniqueDates = Array.from(
      new Set(filteredAttendance.map((a) => new Date(a.date).toLocaleDateString("en-GB")))
    );

    worksheet.columns = [
      { header: "Student ID", key: "studentId", width: 12 },
      { header: "Student Name", key: "studentName", width: 30 },
      { header: "Class", key: "className", width: 12 },
      ...uniqueDates.map((date) => ({ header: date, key: date, width: 12 })),
    ];

    records.students.forEach((student) => {
      const row: any = {
        studentId: student.id,
        studentName: student.name,
        className: student.Class?.name || "N/A",
      };

      uniqueDates.forEach((date) => {
        const a = filteredAttendance.find(
          (att) =>
            att.studentId === student.id &&
            new Date(att.date).toLocaleDateString("en-GB") === date
        );
        if (a) row[date] = a.present ? "Present" : "Absent";
      });

      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Attendance_${from}_to_${to}.xlsx`);
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-900 min-h-screen rounded-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attendance Report</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700"
          />
        </div>

        {role === "admin" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade:</label>
              <select
                className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">Select Grade</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class:</label>
              <select
                className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={!selectedGrade}
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

        <button
          onClick={fetchAttendance}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          Get Attendance
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-wrap gap-4 items-center mt-4">
        <input
          type="text"
          placeholder="Search by name or ID"
          className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          Export Excel
        </button>
      </div>

      {/* Attendance table */}
      {filteredAttendance.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border table-fixed bg-white dark:bg-gray-800 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left text-sm text-gray-900 dark:text-gray-100">
                <th className="p-2 border dark:border-gray-700 w-28">Date</th>
                <th className="p-2 border dark:border-gray-700 w-20">ID</th>
                <th className="p-2 border dark:border-gray-700 w-64">Student Name</th>
                <th className="p-2 border dark:border-gray-700 w-28">Class</th>
                <th className="p-2 border dark:border-gray-700 w-24">Status</th>
                <th className="p-2 border dark:border-gray-700 w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((a) => {
                const student = records.students.find((s) => s.id === a.studentId);
                if (!student) return null;
                return (
                  <tr
                    key={a.id}
                    className="border-b text-sm text-gray-900 dark:text-gray-100 dark:border-gray-700"
                  >
                    <td className="p-1 border dark:border-gray-700">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td className="p-1 border dark:border-gray-700">{student.id}</td>
                    <td className="p-2 border dark:border-gray-700 truncate">{student.name}</td>
                    <td className="p-2 border dark:border-gray-700">{student.Class?.name || "N/A"}</td>
                    <td className="p-1 border dark:border-gray-700">
                      {a.present ? "Present" : "Absent"}
                    </td>
                    <td className="p-1 border dark:border-gray-700">
                      <button
                        onClick={() => updateAttendance(a.id, a.present)}
                        className={`px-2 py-1 text-white rounded ${
                          a.present ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-600 dark:text-gray-400">No attendance records found.</p>
      )}
    </div>
  );
}
