"use client";

import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

type FeeCSV = {
  studentId: string;
  term: string;
  amount: string;
  discountAmount: string;
  fineAmount: string;
  receiptDate: string;
  receiptNo: string;
  remarks: string;
  paymentMode: string;
};

export default function BulkFeeUpload() {
  const [records, setRecords] = useState<FeeCSV[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<FeeCSV>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleaned = results.data.filter(
          (row) => row.studentId && row.term && !isNaN(parseFloat(row.amount))
        );
        setRecords(cleaned);
        setMessage(`Parsed ${cleaned.length} valid records`);
        setErrors([]);
      },
      error: (err) => {
        console.error(err);
        setMessage("❌ Failed to parse file.");
        setRecords([]);
        setErrors(["Invalid CSV format or corrupt file."]);
      },
    });
  };

  const handleUpload = async () => {
    setMessage("");
    setErrors([]);

    try {
      const formattedData = records.map((r) => ({
        studentId: r.studentId.trim(),
        term: r.term.trim(),
        amount: parseFloat(r.amount),
        discountAmount: parseFloat(r.discountAmount) || 0,
        fineAmount: parseFloat(r.fineAmount) || 0,
        receiptDate: r.receiptDate ? new Date(r.receiptDate).toISOString() : null,
        receiptNo: r.receiptNo?.trim() || null,
        remarks: r.remarks?.trim() || null,
        paymentMode: r.paymentMode?.toUpperCase() || "CASH",
      }));

      const res = await axios.post("/api/fees/bulk", formattedData);

      if (res.status === 200) {
        const failed = res.data.results?.filter((r: any) => r.status === "error") || [];

        if (failed.length > 0) {
          setErrors(failed.map((r: any) => `ID ${r.studentId}: ${r.message}`));
          setMessage("⚠️ Upload partially successful with some errors.");
        } else {
          setMessage("✅ All records uploaded successfully.");
          setRecords([]);
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage(err.response?.data?.message || "❌ Upload failed.");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold">Bulk Upload Fees</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-LamaPurple file:text-black hover:file:bg-LamaPurpleLight"
      />

      {message && (
        <div className="text-green-700 font-medium border border-green-200 bg-green-50 p-2 rounded">
          {message}
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border rounded">
          <p className="font-semibold">Upload completed with errors:</p>
          <ul className="list-disc list-inside">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {records.length > 0 && (
        <div className="overflow-auto border border-gray-200 rounded max-h-96">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(records[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border-b font-semibold text-gray-700">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-4 py-1 border-b text-gray-800">
                      {val || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {records.length > 0 && (
        <button
          onClick={handleUpload}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          disabled={records.length === 0}
        >
          Upload to Server
        </button>
      )}
    </div>
  );
}
