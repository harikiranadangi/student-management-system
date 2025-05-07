'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Exam = { id: number; title: string };
type Grade = { id: number; level: string };
type Class = { id: number; name: string };
type Result = {
    id: number;
    marks: number;
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

    useEffect(() => {
        axios.get('/api/exams').then((res) => setExams(res.data.exams));
        axios.get('/api/grades').then((res) => setGrades(res.data));
    }, []);

    useEffect(() => {
        if (!selectedGradeId) return;
        axios.get(`/api/classes?gradeId=${selectedGradeId}`).then((res) => setClasses(res.data));
    }, [selectedGradeId]);

    const fetchResults = async () => {
        if (!selectedExamId || !selectedGradeId || !selectedClassId) return;
        try {
            const res = await axios.get('/api/results', {
                params: {
                    examId: selectedExamId,
                    gradeId: selectedGradeId,
                    classId: selectedClassId,
                },
            });
            setResults(res.data.results);
        } catch (error) {
            console.error('Failed to fetch results', error);
        }
    };

    // Get all unique subject names
    const subjects = Array.from(new Set(results.map((r) => r.Subject.name)));

    // Group results by student
    const studentMap = new Map<
        string,
        { name: string; marks: Record<string, number> }
    >();

    results.forEach((r) => {
        if (!studentMap.has(r.Student.id)) {
            studentMap.set(r.Student.id, {
                name: r.Student.name,
                marks: {},
            });
        }
        const student = studentMap.get(r.Student.id)!;
        student.marks[r.Subject.name] = r.marks;
    });

    const studentRows = Array.from(studentMap.entries()); // [studentId, {name, marks}]

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Exam Results</h2>

            <div className="flex gap-4">
                <select onChange={(e) => setSelectedExamId(Number(e.target.value))} defaultValue="">
                    <option value="" disabled>Select Exam</option>
                    {exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedGradeId(Number(e.target.value))} defaultValue="">
                    <option value="" disabled>Select Grade</option>
                    {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>{grade.level}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedClassId(Number(e.target.value))} defaultValue="">
                    <option value="" disabled>Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                </select>

                <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={fetchResults}
                >
                    Fetch Results
                </button>
            </div>

            {results.length === 0 && (
                <div className="mt-4 text-gray-500">No results available for the selected class.</div>
            )}

            {results.length > 0 && (
                <table className="w-full border mt-6 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 text-left">S.No</th>
                            <th className="border px-2 py-1 text-left">Student ID</th>
                            <th className="border px-2 py-1 text-left">Student</th>
                            {subjects.map((subj) => (
                                <th key={subj} className="border px-2 py-1 text-left">{subj}</th>
                            ))}
                            <th className="border px-2 py-1 text-left">Total</th>
                            <th className="border px-2 py-1 text-left">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentRows.map(([studentId, student], idx) => {
                            const total = subjects.reduce(
                                (sum, subj) => sum + (student.marks[subj] ?? 0),
                                0
                            );
                            const maxPerSubject = 100;
                            const maxTotal = subjects.length * maxPerSubject;
                            const percentage = ((total / maxTotal) * 100).toFixed(1);

                            return (
                                <tr key={idx}>
                                    <td className="border px-2 py-1">{idx + 1}</td>
                                    <td className="border px-2 py-1">{studentId}</td>
                                    <td className="border px-2 py-1">{student.name}</td>
                                    {subjects.map((subj) => (
                                        <td key={subj} className="border px-2 py-1">
                                            {student.marks[subj] ?? '-'}
                                        </td>
                                    ))}
                                    <td className="border px-2 py-1 font-semibold">{total}</td>
                                    <td className="border px-2 py-1 font-semibold">{percentage}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
