// src/components/AddStudentForm.tsx
"use client"; // Mark this component as a client component

import React, { useState } from 'react';
import styles from './AddStudentForm.module.css'; // Import the CSS module

const AddStudentForm = () => {
    const [studentName, setStudentName] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    const [studentMobileNumber, setStudentMobileNumber] = useState('');
    const [studentDateOfBirth, setStudentDateOfBirth] = useState('');
    const [studentAddress, setStudentAddress] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: studentName,
                grade: studentGrade,
                mobileNumber: studentMobileNumber,
                dateOfBirth: studentDateOfBirth,
                address: studentAddress,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Failed to add student:', result);
        } else {
            console.log('Student added successfully:', result);
            // Clear the form after successful submission
            setStudentName('');
            setStudentGrade('');
            setStudentMobileNumber('');
            setStudentDateOfBirth('');
            setStudentAddress('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
                <label className={styles.label}>Name:</label>
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Grade:</label>
                <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Mobile Number:</label>
                <input
                    type="text"
                    value={studentMobileNumber}
                    onChange={(e) => setStudentMobileNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Date of Birth:</label>
                <input
                    type="date"
                    value={studentDateOfBirth}
                    onChange={(e) => setStudentDateOfBirth(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className={styles.label}>Address:</label>
                <input
                    type="text"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Student</button>
        </form>
    );
};

export default AddStudentForm;
