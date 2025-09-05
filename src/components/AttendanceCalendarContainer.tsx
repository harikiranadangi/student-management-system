"use client";

import { useEffect, useState } from "react";
import AttendanceCalendar from "./AttendanceCalendar";

type Props = {
  studentId: string;
};

const AttendanceCalendarContainer = ({ studentId }: Props) => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/attendance/student?studentId=${studentId}`)
      .then((res) => res.json())
      .then((data) => setAttendanceData(data.attendance));
  }, [studentId]);

  return <AttendanceCalendar attendanceData={attendanceData} />;
};

export default AttendanceCalendarContainer;
