"use client";
import {  Student, Class, Grade } from "@prisma/client";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

type Props = {
  data: {
    id: number;
    leaveType: string;
    description: string | null;
    timeIssued: Date;
    student: Student & { Class: Class & { Grade: Grade } };
  }[];
  fileName: string;
};

const ExportButton = ({ data, fileName }: Props) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Permission Slips");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 ,},
      { header: "Student", key: "student", width: 20 },
      { header: "Class", key: "class", width: 15 },
      { header: "Leave Type", key: "leaveType", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Issued Time", key: "time", width: 20 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
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

    // Optional styling
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Student", "Class", "Leave Type", "Description", "Time"]],
      body: data.map((item) => [
        item.id,
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
