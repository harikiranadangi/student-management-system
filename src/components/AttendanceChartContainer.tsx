import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

// Helper function to get the start of the week (Monday at 00:00:00)
const getStartOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysSinceMonday);
  startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day
  return startOfWeek;
};

// Helper function to get the end of the week (Sunday at 23:59:59)
const getEndOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day
  return endOfWeek;
};

const AttendanceChartContainer = async () => {
  const today = new Date();
  const lastMonday = getStartOfWeek(today);
  const endOfWeek = getEndOfWeek(today);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
        lte: endOfWeek,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });


  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const attendanceMap: { [key: string]: { present: number; absent: number } } = {
    Mon: { present: 0, absent: 0 },
    Tue: { present: 0, absent: 0 },
    Wed: { present: 0, absent: 0 },
    Thu: { present: 0, absent: 0 },
    Fri: { present: 0, absent: 0 },
    Sat: { present: 0, absent: 0 },
  };

  resData.forEach(item => {
    const itemDate = new Date(item.date);
    const dayIndex = itemDate.getDay() === 0 ? 6 : itemDate.getDay() - 1;
    const dayName = daysOfWeek[dayIndex];

    // 🔥 Debug logs
    if (attendanceMap[dayName]) {
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });


  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="h-full p-4 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="More" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
