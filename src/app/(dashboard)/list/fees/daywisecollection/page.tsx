"use client";

import { useEffect, useState } from "react";

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

export default function FeeTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/fee-transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fee Transactions</h1>

      {loading ? (
        <div>Loading transactions...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">id No</th>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Student id</th>
                <th className="border px-4 py-2">Class</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{txn.id || "-"}</td>
                  <td className="border px-4 py-2">{txn.student?.name || "-"}</td>
                  <td className="border px-4 py-2">{txn.student?.id || "-"}</td>
                  <td className="border px-4 py-2">{txn.student?.Class?.name || "-"}</td>
                  <td className="border px-4 py-2">₹ {txn.amount}</td>
                  <td className="border px-4 py-2">{new Date(txn.receiptDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{txn.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
