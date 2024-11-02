"use client"; // Mark this component as a client component

import React, { useState } from 'react';

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
            // Reset form fields
            setStudentName('');
            setStudentGrade('');
            setStudentMobileNumber('');
            setStudentDateOfBirth('');
            setStudentAddress('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Name:</label>
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    style={inputStyle}
                />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Grade:</label>
                <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    required
                    style={inputStyle}
                />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Mobile Number:</label>
                <input
                    type="text"
                    value={studentMobileNumber}
                    onChange={(e) => setStudentMobileNumber(e.target.value)}
                    required
                    style={inputStyle}
                />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Date of Birth:</label>
                <input
                    type="date"
                    value={studentDateOfBirth}
                    onChange={(e) => setStudentDateOfBirth(e.target.value)}
                    required
                    style={inputStyle}
                />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Address:</label>
                <input
                    type="text"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                    required
                    style={inputStyle}
                />
            </div>
            <button type="submit" style={buttonStyle}>Add Student</button>
        </form>
    );
};

// Styles
const formStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const inputGroupStyle: React.CSSProperties = {
    marginBottom: '15px',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: 'black',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    color: 'black',
};

const buttonStyle: React.CSSProperties = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

export default AddStudentForm;
