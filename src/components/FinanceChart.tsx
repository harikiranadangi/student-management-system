"use client";

import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Example dataset: Payments collected on different days (replace with real data)
const allData = [
  { date: "2025-03-05", collected: 180000 },
  { date: "2025-03-06", collected: 100000 },
  { date: "2025-03-07", collected: 22000 },
  { date: "2025-03-08", collected: 80000 },
  { date: "2025-03-09", collected: 207000 },
  { date: "2025-03-10", collected: 300000 },
];

// Function to get the first and last day of the previous month
const getLastMonthDateRange = () => {
  const today = new Date();
  const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  return { firstDayLastMonth, lastDayLastMonth };
};

// Filter data for the last month
const lastMonthData = allData.filter(({ date }) => {
  const { firstDayLastMonth, lastDayLastMonth } = getLastMonthDateRange();
  const entryDate = new Date(date);
  return entryDate >= firstDayLastMonth && entryDate <= lastDayLastMonth;
});

const FinanceChart = () => {
  // Format date for the X-axis (e.g., "Feb 1", "Feb 2")
  const formatDateTick = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-xl">
      {/* TITLE */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold">Payments Collected (Last Month)</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={lastMonthData}
          margin={{ top: 5, right: 30, left: 25, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={formatDateTick}
          />
          <YAxis
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
            axisLine={false}
          />
          <Tooltip />
          <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />

          {/* Single Area Chart for "collected" money */}
          <Area
            type="monotone"
            dataKey="collected"
            stroke= "Lamapurple"
            fillOpacity={1}
            fill="url(#colorCollected)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
