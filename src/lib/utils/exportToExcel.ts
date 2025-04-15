// utils/exportToExcel.ts
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportStudentReportToExcel = async (data: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Student Fee Report");

  sheet.columns = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Class", key: "className" },
    { header: "Total Fees", key: "totalFees" },
    { header: "Paid", key: "totalPaidAmount" },
    { header: "Discount", key: "totalDiscountAmount" },
    { header: "Due", key: "dueAmount" },
  ];

  sheet.addRows(data);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "student-fee-report.xlsx");
};
