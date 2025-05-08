"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import hooks to access query params
import { DateFilter } from "./FilterDropdown";

type Transaction = {
  id: number;
  receiptNo?: string;
  amount: number;
  receiptDate: string;
  remarks?: string;
  student: {
    id: string;
    name: string;
    Class: {
      name: string;
    } | null;
  } | null;
};

export default function DailyCollectionReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Get the "date" query parameter from URL
  const receiptDate = searchParams.get("date");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const params: any = {};

        // Only add receiptDate to query if it's present
        if (receiptDate) {
          params.receiptDate = receiptDate;
        }

        // Convert parameters to query string
        const queryString = new URLSearchParams(params).toString();
        const res = await fetch(`/api/fees/fee-transactions?${queryString}`);
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [receiptDate]); // Refetch whenever receiptDate changes

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {/* Date Filter */}
      <DateFilter basePath="/list/reports/daywise-fees" />

      <table className="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID No</th>
            <th className="border px-4 py-2">Receipt Date</th>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Student ID</th>
            <th className="border px-4 py-2">Class</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Receipt No</th>
            <th className="border px-4 py-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{txn.id || "-"}</td>
              <td className="border px-4 py-2">{new Date(txn.receiptDate).toLocaleDateString().split("/").join("-")}</td>
              <td className="border px-4 py-2">{txn.student?.name || "-"}</td>
              <td className="border px-4 py-2">{txn.student?.id || "-"}</td>
              <td className="border px-4 py-2">{txn.student?.Class?.name || "-"}</td>
              <td className="border px-4 py-2">₹ {txn.amount}</td>
              <td className="border px-4 py-2">{txn.receiptNo}</td>
              <td className="border px-4 py-2">{txn.remarks || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
