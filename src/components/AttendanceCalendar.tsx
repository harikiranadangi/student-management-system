"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Attendance {
  date: string | Date;
  present: boolean | null; // null → holiday
}

interface Props {
  attendanceData: Attendance[];
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const AttendanceCalendar = ({ attendanceData }: Props) => {
  const [value, setValue] = useState<Value>(new Date());
  const [tileClassNameMap, setTileClassNameMap] = useState<{ [key: string]: string }>({});

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const map: { [key: string]: string } = {};
    attendanceData.forEach((att) => {
      const day = formatDate(att.date);
      if (att.present === true) map[day] = "present-day";
      else if (att.present === false) map[day] = "absent-day";
      else map[day] = "holiday-day"; // null → holiday
    });
    setTileClassNameMap(map);
  }, [attendanceData]);

  const handleChange = (newValue: Value) => {
    if (newValue instanceof Date) setValue(newValue);
  };

  return (
    <div className="space-y-4">
      <Calendar
        onChange={handleChange}
        value={value instanceof Date ? value : new Date()}
        locale="en-GB"
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const day = formatDate(date);
            return tileClassNameMap[day] || "";
          }
          return "";
        }}
      />

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-500 border border-gray-300"></span>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-500 border border-gray-300"></span>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-400 border border-gray-300"></span>
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
