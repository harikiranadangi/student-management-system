'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Exam = { id: number; title: string };
type Grade = { id: number; level: string };
type Class = { id: number; section: string; name: string };
type Result = {
    id: number;
    marks: number;
    maxMarks: number;
    Student: { id: string; name: string };
    Subject: { id: number; name: string };
    Exam: { id: number; title: string };
};

export default function ResultsViewer() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [results, setResults] = useState<Result[]>([]);

    const [selectedExamId, setSelectedExamId] = useState<number>();
    const [selectedGradeId, setSelectedGradeId] = useState<number>();
    const [selectedClassId, setSelectedClassId] = useState<number>();
    const [role, setRole] = useState<string>();
    const [studentId, setStudentId] = useState<string>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/api/exams').then((res) => setExams(res.data.exams));
        axios.get('/api/grades').then((res) => setGrades(res.data));
    }, []);

    useEffect(() => {
        if (!selectedGradeId) return;
        axios.get(`/api/classes?gradeId=${selectedGradeId}`).then((res) => setClasses(res.data));
    }, [selectedGradeId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/users/me');
                const { role, classId, studentId } = res.data;
                setRole(role);
                if (role === 'teacher') setSelectedClassId(Number(classId));
                if (role === 'student') setStudentId(studentId);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };
        fetchUser();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            let params: any = {};
            if (role === 'student' && studentId) {
                params.studentId = studentId;
            } else if (selectedExamId && selectedGradeId && selectedClassId) {
                params = {
                    examId: selectedExamId,
                    gradeId: selectedGradeId,
                    classId: selectedClassId,
                };
            } else {
                setError('Please select all required fields.');
                setLoading(false);
                return;
            }

            const res = await axios.get('/api/results', { params });
            setResults(res.data.results);
        } catch (error) {
            setError("Failed to fetch results.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const subjects = useMemo(() => {
        return Array.from(new Set(results.map((r) => r.Subject.name))).sort();
    }, [results]);

    const studentMap = useMemo(() => {
        const map = new Map<string, { name: string; marks: Record<string, number> }>();
        results.forEach((r) => {
            if (!map.has(r.Student.id)) {
                map.set(r.Student.id, { name: r.Student.name, marks: {} });
            }
            map.get(r.Student.id)!.marks[r.Subject.name] = r.marks;
        });
        return map;
    }, [results]);

    const studentRows = Array.from(studentMap.entries());

    return (
        <div className="p-6 space-y-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800">Exam Results</h2>

            <div className="flex flex-wrap items-center gap-4 px-2 py-4 bg-gray-50 rounded-lg">
                <label htmlFor="exam-select" className="sr-only">Select Exam</label>
                <select
                    id="exam-select"
                    onChange={(e) => setSelectedExamId(Number(e.target.value))}
                    defaultValue=""
                    className="px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>Select Exam</option>
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                            {exam.title}
                        </option>
                    ))}
                </select>

                {role !== "student" && (
                    <>
                        <select
                            onChange={(e) => setSelectedGradeId(Number(e.target.value))}
                            defaultValue=""
                            className="px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Select Grade</option>
                            {grades.map((grade) => (
                                <option key={grade.id} value={grade.id}>
                                    {grade.level}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            defaultValue=""
                            className="px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.section}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <button
                    onClick={fetchResults}
                    disabled={
                        loading ||
                        (role !== 'student' && (!selectedExamId || !selectedGradeId || !selectedClassId)) ||
                        (role === 'student' && !studentId)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : role === 'student' ? "Fetch My Results" : "Fetch Results"}
                </button>
            </div>

            {error && <div className="text-center text-red-600">{error}</div>}

            {results.length === 0 && !loading && (
                <div className="text-gray-700 text-center py-6">No results available for the selected criteria.</div>
            )}

            {results.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-300 rounded-md overflow-hidden">
                        <thead className="bg-purple-100 text-gray-700">
                            <tr>
                                <th className="px-2 py-2 border text-center">S.No</th>
                                <th className="px-2 py-2 border text-center">Student ID</th>
                                <th className="px-4 py-2 border text-center">Student Name</th>
                                {subjects.map((subj) => (
                                    <th key={subj} className="px-2 py-2 border text-center">{subj}</th>
                                ))}
                                <th className="px-2 py-2 border text-center font-semibold">Total</th>
                                <th className="px-2 py-2 border text-center font-semibold">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentRows.map(([studentId, student], idx) => {
                                // Create subject => maxMarks map (assumes all students have same maxMarks for each subject)
                                const subjectMaxMap = new Map<string, number>();
                                results.forEach((r) => {
                                    if (!subjectMaxMap.has(r.Subject.name)) {
                                        subjectMaxMap.set(r.Subject.name, r.maxMarks);
                                    }
                                });

                                // In your table row rendering:
                                const total = subjects.reduce(
                                    (sum, subj) => sum + (student.marks[subj] ?? 0),
                                    0
                                );
                                const maxTotal = subjects.reduce(
                                    (sum, subj) => sum + (subjectMaxMap.get(subj) ?? 0),
                                    0
                                );
                                const percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : "0.0";


                                return (
                                    <tr key={studentId} className="even:bg-slate-50 hover:bg-purple-50">
                                        <td className="px-2 py-2 border text-center">{idx + 1}</td>
                                        <td className="px-2 py-2 border text-center">{studentId}</td>
                                        <td className="px-4 py-2 border">{student.name}</td>
                                        {subjects.map((subj) => (
                                            <td key={subj} className="px-4 py-2 border text-center">
                                                {student.marks[subj] ?? '-'}
                                            </td>
                                        ))}
                                        <td className="px-2 py-2 border text-center font-medium text-blue-700">{total}</td>
                                        <td className="px-2 py-2 border text-center font-medium text-blue-700">{percentage}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
