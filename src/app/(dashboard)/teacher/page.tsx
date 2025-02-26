"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let dateParam = searchParams.get("date");

    if (!dateParam || isNaN(Date.parse(dateParam))) {
      // Format today's date as YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0]; // Example: "2025-02-26"
      router.replace(`/admin?date=${today}`);
    }
  }, [searchParams, router]);

  // Get the formatted date from URL
  const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      {/* LEFT */}
      <div className="flex flex-col w-full gap-8 lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex flex-wrap justify-between gap-4">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex flex-col w-full gap-8 lg:w-1/3">
        <EventCalendarContainer searchParams={{ date: dateParam }} />
        <Announcements />
      </div>

      {/* DATE DISPLAY */}
      <div className="p-4 mt-4 border rounded-md">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <p className="text-gray-600">Selected Date: {dateParam}</p>
      </div>
    </div>
  );
}
