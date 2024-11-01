// components/StudentsList.tsx
import { useEffect, useState } from 'react';

const StudentsList = () => {
    const [students, setStudents] = useState([]);

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
            {students.map(student => (
                <li key={student.id}>{student.name} - {student.email}</li>
            ))}
        </ul>
    );
};

export default StudentsList;
