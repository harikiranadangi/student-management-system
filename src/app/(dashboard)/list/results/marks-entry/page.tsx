'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Exam = { id: number; title: string; date: string };
type Grade = { id: number; level: string };
type Class = { id: number; name: string };
type Subject = { id: number; name: string };
type Student = { id: string; name: string };

export default function MarksEntryForm() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedExamTitle, setSelectedExamTitle] = useState<string>();
  const [selectedExamId, setSelectedExamId] = useState<number>();
  const [selectedGradeId, setSelectedGradeId] = useState<number>();
  const [selectedClassId, setSelectedClassId] = useState<number>();

  const [marksData, setMarksData] = useState<
    { studentId: string; marks: { [subjectName: string]: string } }[]
  >([]);

  // Fetch exams and grades on load
  useEffect(() => {
    axios.get('/api/exams').then((res) =>{ 
      console.log(res.data); // Inspect the response
      setExams(res.data.exams)})
    axios.get('/api/grades').then((res) => setGrades(res.data)); // You need to create this API if not present
  }, []);

  // Fetch classes on grade change
  useEffect(() => {
    if (!selectedGradeId) return;
    axios.get(`/api/classes?gradeId=${selectedGradeId}`).then((res) => setClasses(res.data)); // Create if not present
  }, [selectedGradeId]);

  // Fetch subjects and students on all three selection changes (exam, grade, class)
  useEffect(() => {
    if (!selectedExamTitle || !selectedGradeId || !selectedClassId) return;
    const fetchExamData = async () => {
      try {
        const res = await axios.get('/api/exams/exam-data', {
          params: {
            examTitle: selectedExamTitle,
            gradeId: selectedGradeId,
            classId: selectedClassId,
          },
        });

        setSelectedExamId(res.data.examId);
        setSubjects(res.data.subjects);
        setStudents(res.data.students);

        const initialMarks = res.data.students.map((student: Student) => ({
          studentId: student.id,
          marks: {},
        }));
        setMarksData(initialMarks);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch exam data');
      }
    };

    fetchExamData();
  }, [selectedExamTitle, selectedGradeId, selectedClassId]);

  const handleMarkChange = (
    studentId: string,
    subjectName: string,
    value: string
  ) => {
    setMarksData((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId
          ? { ...entry, marks: { ...entry.marks, [subjectName]: value } }
          : entry
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedExamId || !selectedGradeId) return alert('Select all fields');

    const payload = {
      gradeId: selectedGradeId,
      examId: selectedExamId,
      entries: marksData,
    };

    try {
      const res = await axios.post('/api/results/bulk-entry', payload);
      alert('Marks submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit marks');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Enter Marks</h2>

      <div className="flex gap-4">
        <select
          onChange={(e) => setSelectedExamTitle(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select Exam
          </option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.title}>
              {exam.title} - {exam.date}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedGradeId(Number(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>
            Select Grade
          </option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.level}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedClassId(Number(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>
            Select Class
          </option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && subjects.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Student</th>
              {subjects.map((subj) => (
                <th key={subj.id} className="border px-2 py-1">
                  {subj.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-2 py-1">{student.name}</td>
                {subjects.map((subj) => (
                  <td key={subj.id} className="border px-2 py-1">
                    <input
                      type="number"
                      value={
                        marksData.find((entry) => entry.studentId === student.id)
                          ?.marks[subj.name] || ''
                      }
                      onChange={(e) =>
                        handleMarkChange(student.id, subj.name, e.target.value)
                      }
                      className="w-16 border px-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Submit Marks
        </button>
      )}
    </div>
  );
}
