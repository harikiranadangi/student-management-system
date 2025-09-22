"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Transaction = {
  id: number;
  receiptNo?: string;
  amount: number;
  receiptDate: string;
  remarks?: string;
  student: {
    id: string;
    name: string;
    Class: { name: string } | null;
  } | null;
};

export default function DailyCollectionReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Date range states
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const params: Record<string, string> = {};
        if (from) params.from = from;
        if (to) params.to = to;

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
  }, [from, to]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);

    router.push(`/list/reports/daywise-fees?${query.toString()}`);
  };

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-300">Loading transactions...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {/* Date Range Filter */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 p-4 mb-4 bg-gray-50 dark:bg-gray-800 rounded"
      >
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 dark:text-gray-400">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 dark:text-gray-400">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded bg-LamaSkyYellow hover:opacity-90"
        >
          Apply
        </button>
      </form>

      {/* Data Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded shadow dark:bg-gray-900 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr className="text-gray-700 dark:text-gray-300">
            <th className="border px-4 py-2 dark:border-gray-700">ID No</th>
            <th className="border px-4 py-2 dark:border-gray-700">Receipt Date</th>
            <th className="border px-4 py-2 dark:border-gray-700">Student Name</th>
            <th className="border px-4 py-2 dark:border-gray-700">Student ID</th>
            <th className="border px-4 py-2 dark:border-gray-700">Class</th>
            <th className="border px-4 py-2 dark:border-gray-700">Amount</th>
            <th className="border px-4 py-2 dark:border-gray-700">Receipt No</th>
            <th className="border px-4 py-2 dark:border-gray-700">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <td className="border px-4 py-2 dark:border-gray-700">{txn.id || "-"}</td>
              <td className="border px-4 py-2 dark:border-gray-700">
                {new Date(txn.receiptDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 dark:border-gray-700">{txn.student?.name || "-"}</td>
              <td className="border px-4 py-2 dark:border-gray-700">{txn.student?.id || "-"}</td>
              <td className="border px-4 py-2 dark:border-gray-700">{txn.student?.Class?.name || "-"}</td>
              <td className="border px-4 py-2 dark:border-gray-700">₹ {txn.amount}</td>
              <td className="border px-4 py-2 dark:border-gray-700">{txn.receiptNo || "-"}</td>
              <td className="border px-4 py-2 dark:border-gray-700">{txn.remarks || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
