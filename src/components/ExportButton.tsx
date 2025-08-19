"use client";

import { Student, Class, Grade } from "@prisma/client";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

type Props = {
  data: {
    id: number;
    date: Date;
    leaveType: string;
    description: string | null;
    timeIssued: Date;
    student: Student & { Class: Class & { Grade: Grade } };
  }[];
  fileName: string;
};

const ExportButton = ({ data, fileName }: Props) => {
  // ✅ Excel Export
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Permission Slips");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Date", key: "date", width: 15 },
      { header: "Student ID", key: "studentId", width: 15 },
      { header: "Student", key: "student", width: 20 },
      { header: "Class", key: "class", width: 15 },
      { header: "Leave Type", key: "leaveType", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Issued Time", key: "time", width: 20 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        date: new Date(item.date).toLocaleDateString("en-GB"),
        studentId: item.student.id, // ✅ fixed
        student: item.student.name,
        class: `${item.student.Class.Grade.level} - ${item.student.Class.section}`,
        leaveType: item.leaveType,
        description: item.description || "-",
        time: new Date(item.timeIssued).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });
    });

    // ✅ Header Styling
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  };

  // ✅ PDF Export
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Report Title
    doc.setFontSize(14);
    doc.text("Permission Slips Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [
        [
          "ID",
          "Date",
          "Student ID",
          "Student",
          "Class",
          "Leave Type",
          "Description",
          "Time",
        ],
      ],
      body: data.map((item) => [
        item.id,
        new Date(item.date).toLocaleDateString("en-GB"),
        item.student.id,
        item.student.name,
        `${item.student.Class.Grade.level} - ${item.student.Class.section}`,
        item.leaveType,
        item.description || "-",
        new Date(item.timeIssued).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 53, 69] }, // red header
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToExcel}
        className="text-xs px-2 py-1 border rounded bg-green-100 hover:bg-green-200"
      >
        Excel
      </button>
      <button
        onClick={exportToPDF}
        className="text-xs px-2 py-1 border rounded bg-red-100 hover:bg-red-200"
      >
        PDF
      </button>
    </div>
  );
};

export default ExportButton;
