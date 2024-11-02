"use client"; // Mark this component as a client component

import React, { useEffect, useState } from 'react';

// Define the type for a student
interface Student {
    id: number; // Assuming you have an 'id' field
    name: string;
    grade: string;
    mobileNumber: string;
}

const StudentsList = () => {
    const [students, setStudents] = useState<Student[]>([]); // Specify the type for students
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>(''); // Specify the type for error

    // Fetch students from the backend API
    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/getStudents'); // Adjust the endpoint as needed
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data: Student[] = await response.json(); // Specify the type of the data
            setStudents(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); // Safely access the message property
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
        <div>
            <h2>Students List</h2>
            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={headerStyle}>Name</th>
                            <th style={headerStyle}>Grade</th>
                            <th style={headerStyle}>Mobile Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td style={cellStyle}>{student.name}</td>
                                <td style={cellStyle}>{student.grade}</td>
                                <td style={cellStyle}>{student.mobileNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Styles
const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
};

const headerStyle: React.CSSProperties = {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'left',
};

const cellStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ddd',
};

export default StudentsList;
