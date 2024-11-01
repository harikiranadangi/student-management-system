// app/components/StudentsList.tsx

"use client";  // Mark this component as a client component

import { useEffect, useState } from 'react';

// Define the Student type
type Student = {
    id: number;
    name: string;
    email: string;
    classId: number;
};

const StudentsList = () => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch('/api/students');
            const data = await response.json();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    return (
        <ul>
            {students.map((student) => (
                <li key={student.id}>
                    {student.name} - {student.email} (Class ID: {student.classId})
                </li>
            ))}
        </ul>
    );
};

export default StudentsList;
