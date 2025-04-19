"use client";
import { useEffect, useState } from "react";
import { Student, Attendance, Class as SchoolClass, Grade } from "@prisma/client";

type AttendanceResponse = {
    attendance: Attendance[];
    students: (Student & { Class: SchoolClass })[];
};

export default function ViewAttendancePage() {
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
    const [selectedClass, setSelectedClass] = useState<string | number>("");

    // Fetch attendance based on date range, grade, and class
    const fetchAttendance = async () => {
        let url = `/api/attendance/range?from=${from}&to=${to}`;
        if (selectedGrade) url += `&gradeId=${selectedGrade}`;
        if (selectedClass) url += `&classId=${selectedClass}`;
        const res = await fetch(url);
        const data = await res.json();
        setRecords(data);
    };

    // Fetch grades and classes when needed
    useEffect(() => {
        async function fetchGradesAndClasses() {
            // Fetch grades
            const gradeRes = await fetch("/api/grades");
            const gradeData = await gradeRes.json();
            setGrades(gradeData);

            // Fetch classes if grade is selected
            if (selectedGrade) {
                const classRes = await fetch(`/api/classes?gradeId=${selectedGrade}`);
                const classData = await classRes.json();
                setClasses(classData);
            }
        }

        fetchGradesAndClasses();
    }, [selectedGrade]); // Only fetch when grade is selected

    useEffect(() => {
        fetchAttendance(); // Fetch attendance after any dependency change
    }, [from, to, selectedGrade, selectedClass]); // Fetch on date or grade/class change

    // Handle attendance update
    const updateAttendance = async (attendanceId: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;

        const res = await fetch(`/api/attendance/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                attendanceId,
                present: newStatus,
            }),
        });

        if (res.ok) {
            setRecords((prevRecords) => {
                const updatedAttendance = prevRecords.attendance.map((a) =>
                    a.id === attendanceId ? { ...a, present: newStatus } : a
                );
                return { ...prevRecords, attendance: updatedAttendance };
            });
        } else {
            console.error("Failed to update attendance");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Attendance Report</h1>

            <div className="flex gap-4 items-end flex-wrap">
                <div>
                    <label className="block text-sm font-medium">From:</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">To:</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>

                <div>
                    {/* Grade Dropdown */}
                    <label className="block text-sm font-medium">Grade:</label>
                    <select className="border px-2 py-1 rounded"
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                    >
                        <option value="">Select Grade</option>
                        {grades.map((grade) => (
                            <option key={grade.id} value={grade.id}>
                                {grade.level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Class Dropdown */}
                <div>
                    <label className="block text-sm font-medium">Class:</label>
                    <select className="border px-2 py-1 rounded"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        disabled={!selectedGrade}
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={fetchAttendance}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    Get Attendance
                </button>
            </div>

            {
                records.attendance.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2 border">Student ID</th>
                                    <th className="p-2 border">Student Name</th>
                                    <th className="p-2 border">Class</th>
                                    <th className="p-2 border">Date</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.attendance.map((a) => {
                                    const student = records.students.find((s) => s.id === a.studentId);
                                    return (
                                        <tr key={a.id} className="border-b">
                                            <td className="p-2 border">{student?.id}</td>
                                            <td className="p-2 border">{student?.name || "Unknown"}</td>
                                            <td className="p-2 border">{student?.Class?.name || "N/A"}</td>
                                            <td className="p-2 border">{new Date(a.date).toLocaleDateString()}</td>
                                            <td className="p-2 border">{a.present ? "Present" : "Absent"}</td>
                                            <td className="p-2 border">
                                                <button
                                                    onClick={() => updateAttendance(a.id, a.present)}
                                                    className={`px-4 text-white py-1 rounded ${a.present ? "bg-green-500" : "bg-red-500"}`}
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
                    <p className="mt-4 text-gray-600">No attendance records found.</p>
                )
            }
        </div>
    );
}
