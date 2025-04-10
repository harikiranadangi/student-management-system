"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { FeeStructure, FeeTransaction, PaymentMode, Term } from "@prisma/client";
import { toast } from "react-toastify";

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
  remarks?: string | null;
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
  const [remarks, setRemarks] = useState<string>("");


  const handleCollect = (studentFee: StudentFees) => {
    setCurrentStudentFee(studentFee);
    setAmount(studentFee.feeStructure.termFees); // Reset
    setDiscount(0); // Reset
    setFine(0); // Reset
    setReceiptDate(""); // Reset
    setReceiptNo(receiptNo); // Reset
    setRemarks(`Collected Fees for ${studentFee.term} on ${new Date().toLocaleDateString()}`); // Properly combine receiptNo and term
    setIsModalOpen(true);
  };

  // * * Submit Form **
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
        remarks,
      };

      try {
        // 1. Update the student fees
        const response = await fetch("/api/fees/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFeeData),
        });

        if (response.ok) {

          // 2. Create a new FeeTransaction
          await fetch("/api/fees/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: currentStudentFee.studentId,
              term: currentStudentFee.term,
              studentFeesId: currentStudentFee.id,  // Assuming you have 'id' in currentStudentFee
              amount,
              discountAmount: discount,
              fineAmount: fine,
              receiptDate,
              receiptNo,
              paymentMode: PaymentMode, // You need to get paymentMode from somewhere (like a dropdown)
              remarks
            }),
          });

          // 3. Update UI state
          const updatedFees = rowData.map((fee) => {
            if (fee.studentId === currentStudentFee.studentId && fee.term === currentStudentFee.term) {
              return {
                ...fee,
                paidAmount: updatedPaidAmount,
                discountAmount: discount,
                fineAmount: fine,
                receiptDate,
                receiptNo,
                remarks,
              };
            }
            return fee;

          });

          setRowData(updatedFees);
          setIsModalOpen(false);
          // ✅ Show success toast
          toast.success("Payment collected successfully!");
        } else {
          const errorMessage = await response.text();
          toast.error(`Failed to collect fees: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong while submitting the form.");
      }
    }
  };


  const handleCancel = async (fee: any) => {
    const isConfirmed = confirm("Are you sure you want to cancel the fees? This will reset Paid Amount to 0.");
    if (!isConfirmed) return;

    const remarks = `Cancelled Fees for ${fee.term} on ${new Date().toLocaleDateString()}`;

    const updatedFeeData = {
      studentId: fee.studentId,
      term: fee.term,
      paidAmount: 0,
      discountAmount: 0,
      fineAmount: 0,
      receiptDate: null,
      receiptNo: receiptNo,
      remarks,
    };

    try {
      // 1. Update student fees
      const response = await fetch("/api/fees/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFeeData),
      });

      if (response.ok) {
        // 2. Create a FeeTransaction for cancellation
        await fetch("/api/fees/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: fee.studentId,
            term: fee.term,
            studentFeesId: fee.id,
            amount: 0,
            discountAmount: 0,
            fineAmount: 0,
            receiptDate: new Date(),
            receiptNo: receiptNo,
            paymentMode: "CANCELLED",
            remarks,
          }),
        });

        // 3. Update UI
        const updatedFees = rowData.map((item) => {
          if (item.studentId === fee.studentId && item.term === fee.term) {
            return {
              ...item,
              paidAmount: 0,
              discountAmount: 0,
              fineAmount: 0,
              receiptDate: null,
              receiptNo: receiptNo,
              remarks,
            };
          }
          return item;
        });

        setRowData(updatedFees);
        toast.success(`Fees for ${fee.term} cancelled successfully!`);
      } else {
        console.error("Failed to cancel fees:", await response.text());
        toast.error("Failed to cancel fees. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling fees:", error);
      toast.error("Error cancelling fees. Please try again.");
    }
  };


  // * * Columns Definition **
  // Define columns for the table using React Table's ColumnDef type
  function getTotalFees(fee: StudentFees) {
    const termFees = fee.feeStructure?.termFees ?? 0;
    const abacusFees = fee.feeStructure?.abacusFees ?? 0;
    return termFees + abacusFees;
  }

  function calculateDueAmount(fee: StudentFees) {
    const totalFees = getTotalFees(fee);
    const paidAmount = fee.paidAmount ?? 0;
    const discountAmount = fee.discountAmount ?? 0;
    const fineAmount = fee.fineAmount ?? 0;

    return totalFees - paidAmount - discountAmount + fineAmount;
  }

  function getFeeStatus(fee: StudentFees) {
    const paidAmount = fee.paidAmount ?? 0;
    const totalFees = getTotalFees(fee);

    const isCollectDisabled = paidAmount >= totalFees;
    const isZero = paidAmount === 0;

    return { paidAmount, totalFees, isCollectDisabled, isZero };
  }


  // Optional: Separate small button components
  const CollectButton = ({ onClick }: { onClick: () => void }) => (
    <button
      className="px-2 py-1 rounded bg-green-400 text-black hover:bg-green-500 transition-all duration-300"
      onClick={onClick}
    >
      Collect
    </button>
  );

  const CancelButton = ({ onClick }: { onClick: () => void }) => (
    <button
      className="px-2 py-1 rounded bg-red-400 text-black hover:bg-red-500 transition-all duration-300"
      onClick={onClick}
    >
      Cancel
    </button>
  );

  const columns = React.useMemo<ColumnDef<StudentFees>[]>(() => [
    {
      accessorKey: "term",
      header: "Term",
    },
    {
      accessorFn: (row) => row.feeStructure?.dueDate,
      id: "dueDate",
      header: "Due Date",
      cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return formatDate(value);
      },
    },
    {
      accessorFn: (row) => {
        const { totalFees } = getFeeStatus(row);
        return totalFees;
      },
      id: "totalFees",
      header: "Total Fees",
      cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return `₹${value.toFixed(2)}`;
      },
    },
    {
      accessorKey: "paidAmount",
      header: "Paid Amount",
      cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return `₹${value.toFixed(2)}`;
      },
    },
    {
      accessorKey: "discountAmount",
      header: "Discount",
      cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return `₹${value.toFixed(2)}`;
      },
    },
    {
      id: "dueAmount",
      header: "Due Amount",
      cell: ({ row }) => {
        const dueAmount = calculateDueAmount(row.original);
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
      cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value;
      },
    },
    {
      accessorFn: (row) => row.receiptDate,
      id: "receiptDate",
      header: "Receipt Date",
      cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return formatDate(value);
      },
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value || "-";
      },
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { isCollectDisabled, isZero } = getFeeStatus(row.original);
        return (
          <div className="flex gap-2">
            {!isCollectDisabled && (
              <CollectButton onClick={() => handleCollect(row.original)} />
            )}
            {!isZero && (
              <CancelButton onClick={() => handleCancel(row.original)} />
            )}
          </div>
        );
      },
    },
  ], [handleCollect, handleCancel]);


  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(rowData);


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
                <label className="block text-sm font-medium">FB No:</label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border p-3 rounded"
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
              <button onClick={handleFormSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Submit
              </button>

              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeesTable;
