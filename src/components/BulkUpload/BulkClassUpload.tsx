"use client";

import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

type ClassCSV = {
  id: string;
  section: string;
  gradeId: string;
  supervisorId?: string;
};

export default function BulkClassUpload() {
  const [classes, setClasses] = useState<ClassCSV[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<ClassCSV>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as ClassCSV[];
        const err: string[] = [];

        parsed.forEach((row, index) => {
          const missing = [];
          if (!row.id) missing.push("id");
          if (!row.section) missing.push("section");
          if (!row.gradeId) missing.push("gradeId");

          if (missing.length > 0) {
            err.push(`Row ${index + 2}: missing ${missing.join(", ")}`);
          }
        });

        setErrors(err);
        setClasses(parsed);
      },
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/classes/bulk-upload", {
        classes,
      });

      setMessage(response.data.message);
      setErrors(response.data.errors || []);
      if (!response.data.errors?.length) {
        setClasses([]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold">Bulk Upload Classes</h1>

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

      {classes.length > 0 && (
        <div className="overflow-auto border border-gray-200 rounded max-h-96">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(classes[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border-b">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {Object.values(cls).map((val, j) => (
                    <td key={j} className="px-4 py-1 border-b">{val || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {classes.length > 0 && (
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
