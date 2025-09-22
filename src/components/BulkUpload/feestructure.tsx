"use client";

import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

type FeeStructureCSV = {
  id: string;
  gradeId: string;
  abacusFees: string;
  termFees: string;
  term: string;
  startDate: string;
  dueDate: string;
  academicYear: string;
};

export default function BulkFeeStructureUpload() {
  const [feeStructures, setFeeStructures] = useState<FeeStructureCSV[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<FeeStructureCSV>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data;
        const err: string[] = [];

        parsed.forEach((row, index) => {
          const missing = [];
          if (!row.id) missing.push("id");
          if (!row.gradeId) missing.push("gradeId");
          if (!row.abacusFees) missing.push("abacusFees");
          if (!row.termFees) missing.push("termFees");
          if (!row.term) missing.push("term");
          if (!row.startDate) missing.push("startDate");
          if (!row.dueDate) missing.push("dueDate");
          if (!row.academicYear) missing.push("academicYear");

          if (missing.length) {
            err.push(`Row ${index + 2} missing: ${missing.join(", ")}`);
          }
        });

        setErrors(err);
        setFeeStructures(parsed);
      },
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/feestructure/bulk-upload", {
        feeStructures,
      });

      setMessage(response.data.message);

      if (response.data.errors?.length) {
        setErrors(response.data.errors);
      } else {
        setErrors([]);
        setFeeStructures([]);
      }
    } catch (error) {
      setMessage("Upload failed. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 text-black dark:text-white rounded shadow">
      <h1 className="text-xl font-semibold">Bulk Upload Fee Structure</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-LamaPurple dark:file:bg-purple-700 file:text-white dark:file:text-white hover:file:bg-LamaPurpleLight dark:hover:file:bg-purple-600"
      />

      {errors.length > 0 && (
        <div className="p-4 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 border rounded">
          <p className="font-semibold">Validation Errors:</p>
          <ul className="mt-2 list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {feeStructures.length > 0 && (
        <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded max-h-96">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                {Object.keys(feeStructures[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b text-gray-700 dark:text-gray-300 dark:border-gray-600"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((row, i) => (
                <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-700">
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="px-4 py-1 border-b dark:border-gray-600"
                    >
                      {val || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {feeStructures.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload to Server"}
        </button>
      )}

      {message && (
        <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>
      )}
    </div>
  );
}
