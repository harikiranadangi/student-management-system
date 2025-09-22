'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

type Exam = { id: number; title: string };
type Grade = { id: number; level: string };
type Class = { id: number; section: string };
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

  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>();
  const [studentId, setStudentId] = useState<string>();
  const [teacherClassId, setTeacherClassId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user info + exams + grades on load
  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await axios.get('/api/users/me');
        const { role, studentId, classId } = userRes.data;
        setRole(role);
        if (role === 'student') setStudentId(studentId);
        if (role === 'teacher') setTeacherClassId(Number(classId));

        const examsRes = await axios.get('/api/exams');
        setExams(examsRes.data.exams);

        // Only admin needs grade/class filters initially
        if (role === 'admin') {
          const gradesRes = await axios.get('/api/grades');
          setGrades(gradesRes.data);
        }

        // If teacher, fetch their class only
        if (role === 'teacher' && classId) {
          const clsRes = await axios.get(`/api/classes?classId=${classId}`);
          setClasses(clsRes.data);
          setSelectedClassId(Number(classId));
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  // Fetch classes when grade changes (for admin)
  useEffect(() => {
    if (role !== 'admin' || !selectedGradeId) return;
    axios.get(`/api/classes?gradeId=${selectedGradeId}`).then((res) => setClasses(res.data));
  }, [selectedGradeId, role]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!selectedExamId) {
        setError('Please select an exam.');
        setLoading(false);
        return;
      }

      let params: any = { examId: selectedExamId };

      if (role === 'student') params.studentId = studentId;
      else if (role === 'teacher') {
        if (!teacherClassId) {
          setError('No class assigned.');
          setLoading(false);
          return;
        }
        params.classId = teacherClassId;
      } else if (role === 'admin') {
        if (!selectedGradeId || !selectedClassId) {
          setError('Please select grade and class.');
          setLoading(false);
          return;
        }
        params.gradeId = selectedGradeId;
        params.classId = selectedClassId;
      }

      const res = await axios.get('/api/results', { params });
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const subjects = useMemo(() => Array.from(new Set(results.map(r => r.Subject.name))).sort(), [results]);
  const studentMap = useMemo(() => {
    const map = new Map<string, { name: string; marks: Record<string, number> }>();
    results.forEach(r => {
      if (!map.has(r.Student.id)) map.set(r.Student.id, { name: r.Student.name, marks: {} });
      map.get(r.Student.id)!.marks[r.Subject.name] = r.marks;
    });
    return map;
  }, [results]);
  const studentRows = Array.from(studentMap.entries());

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Exam Results</h2>

      <div className="flex flex-wrap items-center gap-4 px-2 py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {/* Exam dropdown */}
        <select
          onChange={e => setSelectedExamId(Number(e.target.value))}
          value={selectedExamId ?? ''}
          className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="" disabled>Select Exam</option>
          {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
        </select>

        {/* Admin: grade & class dropdown */}
        {role === 'admin' && (
          <>
            <select
              onChange={e => { setSelectedGradeId(Number(e.target.value)); setSelectedClassId(undefined); }}
              value={selectedGradeId ?? ''}
              className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>Select Grade</option>
              {grades.map(g => <option key={g.id} value={g.id}>{g.level}</option>)}
            </select>

            <select
              onChange={e => setSelectedClassId(Number(e.target.value))}
              value={selectedClassId ?? ''}
              className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.section}</option>)}
            </select>
          </>
        )}

        <button
          onClick={fetchResults}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-md shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Fetch Results'}
        </button>
      </div>

      {error && <div className="text-center text-red-600 dark:text-red-400">{error}</div>}

      {results.length === 0 && !loading && (
        <div className="text-gray-700 dark:text-gray-300 text-center py-6">No results available.</div>
      )}

      {results.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <thead className="bg-purple-100 dark:bg-purple-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-2 py-2 border text-center">S.No</th>
                <th className="px-2 py-2 border text-center">Student ID</th>
                <th className="px-4 py-2 border text-center">Student Name</th>
                {subjects.map(subj => <th key={subj} className="px-2 py-2 border text-center">{subj}</th>)}
                <th className="px-2 py-2 border text-center font-semibold">Total</th>
                <th className="px-2 py-2 border text-center font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {studentRows.map(([id, student], idx) => {
                const subjectMaxMap = new Map<string, number>();
                results.forEach(r => { if (!subjectMaxMap.has(r.Subject.name)) subjectMaxMap.set(r.Subject.name, r.maxMarks); });
                const total = subjects.reduce((sum, subj) => sum + (student.marks[subj] ?? 0), 0);
                const maxTotal = subjects.reduce((sum, subj) => sum + (subjectMaxMap.get(subj) ?? 0), 0);
                const percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={id} className="even:bg-slate-50 dark:even:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700">
                    <td className="px-2 py-2 border text-center">{idx + 1}</td>
                    <td className="px-2 py-2 border text-center">{id}</td>
                    <td className="px-4 py-2 border">{student.name}</td>
                    {subjects.map(subj => <td key={subj} className="px-4 py-2 border text-center">{student.marks[subj] ?? '-'}</td>)}
                    <td className="px-2 py-2 border text-center font-medium text-blue-700 dark:text-blue-400">{total}</td>
                    <td className="px-2 py-2 border text-center font-medium text-blue-700 dark:text-blue-400">{percentage}%</td>
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
