"use client";

import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

type GradeCSV = {
  id: string;
  level: string;
};

export default function BulkGradeUpload() {
  const [grades, setGrades] = useState<GradeCSV[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<GradeCSV>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as GradeCSV[];
        const err: string[] = [];

        parsed.forEach((row, index) => {
          const missingFields = [];

          if (!row.id) missingFields.push("id");
          if (!row.level) missingFields.push("level");

          if (missingFields.length > 0) {
            err.push(`Row ${index + 2} missing: ${missingFields.join(", ")}`);
          }
        });

        setErrors(err);
        setGrades(parsed);
      },
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("/api/grades/bulk-upload", {
        grades,
      });

      setMessage(response.data.message);
      if (response.data.errors?.length) {
        setErrors(response.data.errors);
      } else {
        setErrors([]);
        setGrades([]);
      }
    } catch (error) {
      setMessage("Upload failed. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h1 className="text-xl font-semibold">Bulk Upload Grades</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-LamaPurple file:text-black hover:file:bg-LamaPurpleLight dark:file:bg-purple-700 dark:file:text-white dark:hover:file:bg-purple-600"
      />

      {errors.length > 0 && (
        <div className="p-4 text-sm text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900 border rounded">
          <p className="font-semibold">Validation Errors:</p>
          <ul className="mt-2 list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {grades.length > 0 && (
        <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded max-h-96">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                {Object.keys(grades[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border-b dark:border-gray-600">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, i) => (
                <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-700">
                  {Object.values(grade).map((val, j) => (
                    <td key={j} className="px-4 py-1 border-b dark:border-gray-600">
                      {val || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {grades.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload to Server"}
        </button>
      )}

      {message && <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>}
    </div>
  );
}
