// src/components/StudentsList.tsx
"use client"; // Ensure this component is rendered on the client

import React, { useEffect, useState } from 'react';

// Define the type for a student
interface Student {
    id: number;
    name: string;
    grade: string;
    mobileNumber: string;
    dateOfBirth: string; // Add any other properties you need
    address: string; // Add any other properties you need
}

const StudentsList = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students');
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data: Student[] = await response.json();
            setStudents(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Mobile Number</th>
                    <th>Date of Birth</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                    <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.grade}</td>
                        <td>{student.mobileNumber}</td>
                        <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                        <td>{student.address}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentsList;
