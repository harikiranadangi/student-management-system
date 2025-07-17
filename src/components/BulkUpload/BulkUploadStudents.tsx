"use client";

import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

type StudentCSV = {
  id: string;
  username: string;
  name: string;
  parentName?: string;
  email?: string;
  phone: string;
  address?: string;
  img?: string;
  bloodType?: string;
  gender: string;
  dob: string;
  classId: string;
  clerk_id?: string;
  academicYear: string;
};

export default function BulkStudentUpload() {
  const [students, setStudents] = useState<StudentCSV[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<StudentCSV>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as StudentCSV[];
        const err: string[] = [];

        // Validate each row
        parsed.forEach((row, index) => {
          if (!row.id || !row.username || !row.name || !row.phone || !row.dob || !row.classId) {
            err.push(`Row ${index + 2} missing required fields`);
          }
        });

        setErrors(err);
        setStudents(parsed);
      },
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("/api/students/bulk-upload", {
        students,
      });

      setMessage(response.data.message);
      if (response.data.errors?.length) {
        setErrors(response.data.errors);
      } else {
        setErrors([]);
        setStudents([]);
      }
    } catch (error) {
      setMessage("Upload failed. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Bulk Upload Students</h1>
        
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-LamaPurple file:text-black hover:file:bg-LamaPurpleLight"
      />

      {errors.length > 0 && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border rounded">
          <p className="font-semibold">Validation Errors:</p>
          <ul className="mt-2 list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {students.length > 0 && (
        <div className="overflow-auto border border-gray-200 rounded max-h-96">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(students[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border-b">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {Object.values(student).map((val, j) => (
                    <td key={j} className="px-4 py-1 border-b">{val || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload to Server"}
        </button>
      )}

      {message && <p className="text-green-600 font-medium">{message}</p>}
    </div>
  );
}
