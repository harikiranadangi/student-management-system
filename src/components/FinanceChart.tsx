"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Image from "next/image";

type ChartData = {
  date: string;
  collected: number;
};

export default function FinanceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch("/api/fees/daily-summary");
        const data = await res.json();

        // Ensure sorted data by date in ascending order
        const sorted = data
          .map((item: any) => ({
            date: item.date,
            collected: item.collected,
          }))
          .sort((a: ChartData, b: ChartData) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });

        setChartData(sorted);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  const formatDateTick = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <div>Loading chart...</div>;

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-xl shadow">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold">Payments Collected (Last 30 Days)</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={chartData}
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
            tick={{ fill: "#6b7280" }}
            tickFormatter={formatDateTick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />
          <Area
            type="monotone"
            dataKey="collected"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorCollected)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
