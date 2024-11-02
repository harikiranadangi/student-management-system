// AddStudentForm.tsx
"use client"; // Mark this component as a client component

import React, { useState } from 'react';

const AddStudentForm = () => {
    const [studentName, setStudentName] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    const [studentMobileNumber, setStudentMobileNumber] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: studentName,
                grade: studentGrade,
                mobileNumber: studentMobileNumber,
                // Removed teacherId since you don't have teachers yet
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('Failed to add student:', result);
            // Handle the error appropriately (e.g., show a message to the user)
        } else {
            // Handle the success (e.g., clear the form or show a success message)
            console.log('Student added successfully:', result);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Grade:</label>
                <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Mobile Number:</label>
                <input
                    type="text"
                    value={studentMobileNumber}
                    onChange={(e) => setStudentMobileNumber(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Student</button>
        </form>
    );
};

export default AddStudentForm;
