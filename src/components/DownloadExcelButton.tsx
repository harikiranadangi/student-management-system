'use client';

import { exportStudentReportToExcel } from '@/lib/utils/exportToExcel';
import React from 'react';

interface Props {
  data: any[];
}

const DownloadExcelButton: React.FC<Props> = ({ data }) => {
  const handleDownload = () => {
    exportStudentReportToExcel(data);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-800"
    >
      Download Excel
    </button>
  );
};

export default DownloadExcelButton;
