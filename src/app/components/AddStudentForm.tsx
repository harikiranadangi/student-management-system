// app/components/AddStudentForm.tsx

"use client";  // Mark this component as a client component

import { useState } from 'react';

const AddStudentForm = () => {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [classId, setClassId] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const studentData = {
            name,
            email,
            classId: Number(classId), // Ensure classId is a number
        };
        console.log('Submitting student data:', studentData); // Log the data being submitted

        const response = await fetch('/api/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });

        if (response.ok) {
            // Handle success (e.g., clear the form, show a message)
            setMessage('Student added succesfully');
            setName('');
            setEmail('');
            setClassId('');
        } else {
            // Handle error
            const errorText = await response.text(); // Get error text from response
            console.error('Failed to add student:', errorText); // Log the error details
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Class ID"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
            />
            <button type="submit">Add Student</button>
        </form>
    );
};

export default AddStudentForm;
