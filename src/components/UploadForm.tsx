// components/UploadForm.tsx
import { useState } from 'react';

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        setMessage(data.message || 'Error uploading file');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button type="submit">Upload</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UploadForm;
