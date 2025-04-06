"use client";

import React, { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { FeeStructure, FeeTransaction } from "@prisma/client";

// Interface for StudentFees (same as before)
interface StudentFees {
  id: number;
  studentId: string;
  feeStructureId: number;
  term: string;
  paidAmount: number;
  discountAmount: number;
  fineAmount: number;
  abacusPaidAmount?: number | null;
  receivedDate: string | null;
  receiptDate: string | null;
  paymentMode: string;
  feeStructure: FeeStructure;
  feeTransactions: FeeTransaction[];
  collectedAmount?: number;
  receiptNo?: string | null;
}

interface FeesTableProps {
  data: StudentFees[];
}

function formatDate(value: string | Date | undefined | null) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toISOString().split("T")[0];
}

const FeesTable: React.FC<FeesTableProps> = ({ data }) => {
  const [rowData, setRowData] = useState<StudentFees[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudentFee, setCurrentStudentFee] = useState<StudentFees | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [receiptDate, setReceiptDate] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [fine, setFine] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<string>("");


  const handleCollect = (studentFee: StudentFees) => {
    setCurrentStudentFee(studentFee);
    setAmount(0); // Reset
    setDiscount(0); // Reset
    setFine(0); // Reset
    setReceiptDate(""); // Reset
    setIsModalOpen(true);
  };


  const handleFormSubmit = async () => {
    if (currentStudentFee) {
      const updatedPaidAmount = currentStudentFee.paidAmount + amount;
  
      const updatedFeeData = {
        studentId: currentStudentFee.studentId,
        term: currentStudentFee.term,
        paidAmount: updatedPaidAmount,
        discountAmount: discount,
        fineAmount: fine,
        receiptDate,
        receiptNo,
      };
  
      try {
        const response = await fetch("/api/fees/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFeeData),
        });
  
        if (response.ok) {
          const updatedFees = rowData.map((fee) => {
            if (fee.studentId === currentStudentFee.studentId) {
              // 👇 If it's the SAME STUDENT
              if (fee.term !== currentStudentFee.term && !fee.receiptNo) {
                // 👇 Only update other terms if receiptNo is EMPTY
                return { ...fee, receiptNo };
              }
              if (fee.term === currentStudentFee.term) {
                // 👇 Update the term you edited with new paidAmount, etc
                return {
                  ...fee,
                  paidAmount: updatedPaidAmount,
                  discountAmount: discount,
                  fineAmount: fine,
                  receiptDate,
                  receiptNo,
                };
              }
            }
            return fee;
          });
  
          setRowData(updatedFees);
          setIsModalOpen(false);
        } else {
          console.error("Failed to update fee data.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };
  

  const columns = React.useMemo<ColumnDef<StudentFees>[]>(() => [
    {
      accessorKey: "term",
      header: "Term",
    },
    {
      accessorFn: (row) => row.feeStructure?.dueDate,
      id: "dueDate",
      header: "Due Date",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      accessorFn: (row) => {
        const termFees = row.feeStructure?.termFees ?? 0;
        const abacusFees = row.feeStructure?.abacusFees ?? 0;
        return termFees + abacusFees;
      },
      id: "totalFees",
      header: "Total Fees",
      cell: ({ getValue }) => `₹${(getValue() as number)?.toFixed(2)}`,
    },
    {
      accessorKey: "paidAmount",
      header: "Paid Amount",
      cell: ({ getValue }) => `₹${(getValue() as number)?.toFixed(2)}`,
    },
    {
      accessorKey: "discountAmount",
      header: "Discount",
      cell: ({ getValue }) => `₹${(getValue() as number)?.toFixed(2)}`,
    },
    {
      accessorKey: "fineAmount",
      header: "Fine",
      cell: ({ getValue }) => `₹${(getValue() as number)?.toFixed(2)}`,
    },
    {
      id: "dueAmount",
      header: "Due Amount",
      cell: ({ row }) => {
        const total = (row.original.feeStructure?.termFees ?? 0) + (row.original.feeStructure?.abacusFees ?? 0);
        const paid = row.original.paidAmount ?? 0;
        const dueAmount = total - paid - row.original.discountAmount + row.original.fineAmount;
        return (
          <span style={{ color: dueAmount > 0 ? "red" : "green" }}>
            ₹{dueAmount.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "receiptNo",
      header: "FB No",
      cell: ({ getValue }) => (getValue() as string),
    },
    {
      accessorKey: "receiptDate",
      header: "Receipt Date",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleCollect(row.original)}
        >
          Collect
        </button>
      ),
    },
  ], [rowData]);

  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });



  return (
    <div className="p-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && currentStudentFee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-4">

            <h2 className="text-2xl font-bold text-center">Collect Fees</h2>

            {/* Fee Details */}
            <div className="space-y-1 text-sm">
              <p><strong>Total Fees:</strong> ₹{(currentStudentFee.feeStructure?.termFees || 0) + (currentStudentFee.feeStructure?.abacusFees || 0)}</p>
              <p><strong>Paid Amount:</strong> ₹{currentStudentFee.paidAmount || 0}</p>
              <p><strong>Balance:</strong> ₹{
                ((currentStudentFee.feeStructure?.termFees || 0) + (currentStudentFee.feeStructure?.abacusFees || 0))
                - (currentStudentFee.paidAmount || 0) - (currentStudentFee.discountAmount || 0)
              }</p>
            </div>

            {/* Input Fields */}
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Amount Paying Now:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Discount:</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Fine:</label>
                <input
                  type="number"
                  value={fine}
                  onChange={(e) => setFine(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">FB No:</label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Receipt Date:</label>
                <input
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Remaining Balance after payment */}
            <div className="text-sm text-blue-700 font-semibold">
              Remaining after this payment: ₹{Math.max(
                0,
                (
                  ((currentStudentFee.feeStructure?.termFees || 0) + (currentStudentFee.feeStructure?.abacusFees || 0) - discount)
                  - (currentStudentFee.paidAmount + amount + fine)
                )
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeesTable;
