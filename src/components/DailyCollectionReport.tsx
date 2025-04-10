"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF type to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

type FeeTransaction = {
  id: number;
  studentId: string;
  studentFeesId: number;
  amount: number;
  discountAmount: number;
  fineAmount: number;
  receiptDate: string; // Date as string
  receiptNo?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
};

export default function DailyCollectionReport() {
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/fee-transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();

    const headers = [["Receipt No", "Amount", "Date", "Remarks"]];
    const rows: any[] = [];

    transactions.forEach((txn) => {
      rows.push([
        txn.receiptNo || "-",
        txn.amount || 0,
        txn.receiptDate ? new Date(txn.receiptDate).toLocaleDateString() : "-",
        txn.remarks || "-",
      ]);
    });

    autoTable(doc, {
      head: headers,
      body: rows,
    });

    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Use lastAutoTable properly
    if (doc.lastAutoTable) {
      doc.text(`Total Collection: ₹${totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
    }

    doc.save("Daily_Collection_Report.pdf");
  };

  const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Collection Report</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading transactions...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={exportToPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
            >
              Export as PDF
            </button>
          </div>

          <div className="shadow rounded-lg overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Receipt No</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="border px-4 py-2 text-center">{txn.receiptNo || "-"}</td>
                    <td className="border px-4 py-2 text-center">₹{txn.amount}</td>
                    <td className="border px-4 py-2 text-center">{new Date(txn.receiptDate).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{txn.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-gray-100">
                  <td className="border px-4 py-2 text-right" colSpan={1}>Total</td>
                  <td className="border px-4 py-2 text-center">₹{totalAmount}</td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
