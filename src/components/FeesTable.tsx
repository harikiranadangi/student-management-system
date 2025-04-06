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
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [fine, setFine] = useState<number>(0);

  const handleCollect = (studentFee: StudentFees) => {
    setCurrentStudentFee(studentFee);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (currentStudentFee) {
      // Send API request to update fee in Prisma
      const updatedFeeData = {
        studentId: currentStudentFee.studentId,
        term: currentStudentFee.term,
        paidAmount: currentStudentFee.paidAmount + amount - discount + fine,
        discountAmount: discount,
        fineAmount: fine,
        receiptDate,
        receiptNumber,
      };

      try {
        const response = await fetch("/api/update-fee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFeeData),
        });

        if (response.ok) {
          const updatedRowData = await response.json();

          // Update the rowData in the state with the new paidAmount and other updated values
          const updatedRow = rowData.map((fee) =>
            fee.id === currentStudentFee.id
              ? {
                  ...fee,
                  paidAmount: fee.paidAmount + amount - discount + fine,
                  discountAmount: discount,
                  fineAmount: fine,
                  receiptDate,
                  receiptNumber,
                }
              : fee
          );
          setRowData(updatedRow); // Update the table with the new data

          setIsModalOpen(false); // Close the modal
        } else {
          console.error("Failed to update fee data");
        }
      } catch (error) {
        console.error("Error updating fee data", error);
      }
    }
  };

  const columns = React.useMemo<ColumnDef<StudentFees>[]>(() => [
    {
      accessorKey: "term",
      header: "Term",
    },
    {
      accessorFn: (row) => row.feeStructure?.startDate,
      id: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => formatDate(getValue() as string),
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
        const dueAmount = total - paid;
        return (
          <span style={{ color: dueAmount > 0 ? "red" : "green" }}>
            ₹{dueAmount.toFixed(2)}
          </span>
        );
      },
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
        <div className="modal">
          <h2>Collect Fees for {currentStudentFee.studentId}</h2>
          <form onSubmit={handleFormSubmit}>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <label>Discount:</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
            />
            <label>Fine:</label>
            <input
              type="number"
              value={fine}
              onChange={(e) => setFine(parseFloat(e.target.value))}
            />
            <label>Receipt Date:</label>
            <input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
            />
            <label>Receipt Number:</label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeesTable;
