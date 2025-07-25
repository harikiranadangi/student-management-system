"use client";
import React, { useCallback, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { FeeStructure, FeeTransaction } from "@prisma/client";
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
  mode: "collect" | "cancel"; // Add mode prop to determine the action
}


function formatDate(value: string | Date | undefined | null) {
  if (!value) return "-";

  const date = new Date(value);

  // Format the date as dd-mm-yyyy
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');; // en-GB returns date as dd/mm/yyyy
}


const FeesTable: React.FC<FeesTableProps> = ({ data, mode }) => {
  const [rowData, setRowData] = useState<StudentFees[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudentFee, setCurrentStudentFee] = useState<StudentFees | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [receiptDate, setReceiptDate] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [fine, setFine] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<string>();
  const [remarks, setRemarks] = useState<string>("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("CASH");
  


  const handleCollect = useCallback((studentFee: StudentFees) => {
    const dueAmount = calculateDueAmount(studentFee);
    console.log("studentFee in handleCollect", studentFee);

    console.log("Calculated dueAmount:", dueAmount); // optional debug

    setCurrentStudentFee(studentFee);
    setAmount(dueAmount > 0 ? dueAmount : 0); // ✅ Set correct due
    // ❌ DO NOT SET termFees again!
    setDiscount(0);
    setFine(0);
    setReceiptDate(new Date().toISOString().split("T")[0]);
    setReceiptNo(studentFee.receiptNo || studentFee.feeTransactions?.[0]?.receiptNo || "");
    setRemarks(studentFee.remarks || `Collected Fees for ${studentFee.term} on ${formatDate(new Date())}`);
    setIsModalOpen(true);
  }, []);


  // * * Submit Form **
  const handleFormSubmit = async () => {
    if (!currentStudentFee) return;

    const dueAmount = calculateDueAmount(currentStudentFee);

    if (amount + discount > dueAmount) {
      toast.error("Total of payment and discount exceeds due amount.");
      return;
    }

    console.log("Amount attempting to pay:", amount);

    const updatedPaidAmount = currentStudentFee.paidAmount + amount;

    const updatedFeeData = {
      studentId: currentStudentFee.studentId,
      term: currentStudentFee.term,
      amount,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFeeData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`Failed to collect fees: ${errorMessage}`);
        return;
      }

      // 2. Prepare transaction payload safely
      const transactionPayload: any = {
        studentId: currentStudentFee.studentId,
        term: currentStudentFee.term,
        studentFeesId: currentStudentFee.id,
        paidAmount: amount,
        discountAmount: discount,
        fineAmount: fine,
        paymentMode: selectedPaymentMode,
        remarks,
      };

      if (receiptDate) {
        const parsed = new Date(receiptDate);
        if (!isNaN(parsed.getTime())) {
          transactionPayload.receiptDate = parsed.toISOString();
        }
      }

      if (receiptNo?.trim()) {
        transactionPayload.receiptNo = receiptNo.trim();
      }


      // 4. Update local UI state
      const updatedFees = rowData.map((fee) =>
        fee.studentId === currentStudentFee.studentId && fee.term === currentStudentFee.term
          ? {
            ...fee,
            paidAmount: updatedPaidAmount,
            discountAmount: discount,
            fineAmount: fine,
            receiptDate,
            receiptNo,
            remarks,
          }
          : fee
      );

      setRowData(updatedFees);
      setIsModalOpen(false);
      window.location.href = `/list/fees/collect/${currentStudentFee.studentId}`;
      toast.success("Payment collected successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong while submitting the form.");
    }
  };

  const handleCancel = useCallback(async (fee: any, remarks: string) => {
    if (!fee.studentId || !fee.term) {
      toast.error("Missing studentId or term");
      return;
    }
  
    const confirmed = window.confirm(`Are you sure you want to cancel fees for ${fee.term}?`);
    if (!confirmed) return;
  
    try {
      const cancelRes = await fetch("/api/fees/cancel-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: fee.studentId, term: fee.term }),
      });
  
      if (!cancelRes.ok) {
        const { message } = await cancelRes.json();
        toast.error(`Cancel transaction failed: ${message}`);
        return;
      }
  
      const updatedFeeData = {
        studentId: fee.studentId,
        term: fee.term,
        amount: 0,
        discountAmount: 0,
        fineAmount: 0,
        receiptNo: "",
        receiptDate: fee.receiptDate ? new Date(fee.receiptDate).toISOString() : null,
        paymentMode: "CASH",
        remarks: remarks || "Fees cancelled",
      };
  
      const updateRes = await fetch("/api/fees/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFeeData),
      });
  
      if (!updateRes.ok) {
        const { message } = await updateRes.json();
        toast.error(`Fee update failed: ${message}`);
        return;
      }
  
      setRowData((prev) =>
        prev.map((f) =>
          f.studentId === fee.studentId && f.term === fee.term
            ? {
                ...f,
                paidAmount: 0,
                discountAmount: 0,
                fineAmount: 0,
                receiptNo: "",
                receiptDate: updatedFeeData.receiptDate,
                remarks: updatedFeeData.remarks,
              }
            : f
        )
      );
  
      setIsModalOpen(false);
      window.location.href = `/list/fees/cancel/${fee.studentId}`;
      toast.success("Fees successfully cancelled.");
    } catch (error) {
      console.error("Error during fee cancellation:", error);
      toast.error("An error occurred during the cancellation process.");
    }
  }, [rowData]);
  

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
    const dueAmount = calculateDueAmount(fee);

    const paidAmount = fee.paidAmount ?? 0;
    const totalFees = getTotalFees(fee);

    const isCollectDisabled = dueAmount <= 0;
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
      accessorFn: (row) => row.feeTransactions?.[0]?.receiptNo || "",
      id: "receiptNo",
      header: "FB No",
      cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value || "-";
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
      accessorFn: (row) => row.feeTransactions?.[0]?.remarks || "",
      id: "remarks",
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

        if (mode === "collect") {
          // When mode is 'collect'
          return (
            <div className="flex gap-2">
              {!isCollectDisabled && (
                <CollectButton onClick={() => handleCollect(row.original)} />
              )}
            </div>
          );
        } else if (mode === "cancel") {
          // When mode is 'cancel'
          return (
            <div className="flex gap-2">
              {!isZero && (
                <CancelButton onClick={() => handleCancel(row.original, remarks)} />
              )}
            </div>
          );
        }

        // Default fallback if mode is unknown
        return null;
      },
    },

  ], [handleCollect, handleCancel, mode]);



  const table = useReactTable({
    data: rowData as StudentFees[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log("Updated Fees Data", rowData);


  return (
    <div className=" overflow-x-auto">
      <div className="min-w-full rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-gray-700m">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider bg-LamaSky">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-2 py-3 text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


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

              <div className="w-full text-sm rounded bg-white border-gray-300 border">
                <select
                  value={selectedPaymentMode}
                  onChange={(e) => setSelectedPaymentMode(e.target.value)}
                  className="w-full p-2 rounded"
                >
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI</option>
                  <option value="ONLINE">CARD</option>
                  <option value="BANK_TRANSFER">BANK TRANSFER</option>
                </select>
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
              {
                (
                  <button
                    onClick={handleFormSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Submit
                  </button>
                )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 transition"
              >
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
