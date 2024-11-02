"use client"; // Mark this component as a client component

import React, { useState } from 'react';

const AddStudentForm = () => {
    // State hooks for form inputs
    const [studentName, setStudentName] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    const [studentMobileNumber, setStudentMobileNumber] = useState('');

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Send POST request to the API
        const response = await fetch('/api/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: studentName,
                grade: studentGrade,
                mobileNumber: studentMobileNumber,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Failed to add student:', result);
            // Handle the error appropriately (e.g., show a message to the user)
        } else {
            console.log('Student added successfully:', result);
            // Clear the form fields after successful submission
            setStudentName('');
            setStudentGrade('');
            setStudentMobileNumber('');
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
    color: 'black',  // Black font color for labels
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    color: 'black',  // Black font color for input text
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

// Optional: Style for hover effect on button
const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    // Add hover styles here if needed
};

export default AddStudentForm;
