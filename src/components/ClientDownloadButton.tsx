"use client";

import React from "react";

// Function to convert the student data to CSV
const convertToCSV = (data: any[]) => {
  const header = ["ID", "Name", "Class", "Total Fees", "Paid", "Discount", "Due"];
  const rows = data.map((student) => [
    student.id,
    student.name,
    student.className,
    student.totalFees,
    student.totalPaidAmount,
    student.totalDiscountAmount,
    student.dueAmount,
  ]);

  // Convert header and rows into a single CSV string
  const csvContent = [
    header.join(","), // Header row
    ...rows.map((row) => row.join(",")), // Data rows
  ]
    .join("\n")
    .replace(/\n/g, "\r\n"); // For proper line endings on Windows

  return csvContent;
};

// Function to trigger the download of CSV file
const downloadCSV = (data: any[]) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "student_fees_report.csv";
  link.click();
};

const ClientDownloadButton = ({ data }: { data: any[] }) => {
  return (
    <button
      onClick={() => downloadCSV(data)}
      className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
      Download Report as CSV
    </button>
  );
};

export default ClientDownloadButton;
