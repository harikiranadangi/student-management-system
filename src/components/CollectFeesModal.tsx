"use client";
import { useState } from "react";

// Define the expected structure of the 'fee' object
interface Fee {
  id: number;
  term: string;
  // Add more fields if needed
}

interface CollectFeesModalProps {
  fee: Fee;
  onClose: () => void;
}

export default function CollectFeesModal({ fee, onClose }: CollectFeesModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [discount, setDiscount] = useState("");

  const handleCollectFees = async () => {
    const amountNum = parseInt(amount);
    const discountNum = parseInt(discount) || 0;

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      return alert("Enter a valid amount");
    }

    const res = await fetch("/api/collect-fees", {
      method: "POST",
      body: JSON.stringify({
        studentFeesId: fee.id,
        amountPaid: amountNum,
        paymentMode,
        discountGiven: discountNum,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Payment Successful");
      onClose();
      window.location.reload();
    } else {
      alert("Payment Failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
        <h1 className="text-lg font-semibold">Collect Fees (Term {fee.term.replace("_", " ")})</h1>

        <label className="block mt-4 text-gray-600">Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        <label className="block mt-4 text-gray-600">Payment Mode</label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="CASH">Cash</option>
          <option value="ONLINE">Online</option>
          <option value="UPI">UPI</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>

        <label className="block mt-4 text-gray-600">Discount (if any)</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        <button
          onClick={handleCollectFees}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Submit Payment
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 text-black py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
