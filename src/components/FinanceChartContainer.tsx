"use client";

import { useEffect, useState } from "react";
import FinanceChart from "./FinanceChart";

type ChartData = {
  date: string;
  collected: number;
};

export default function FinanceChartContainer() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch("/api/fees/daily-summary");
        const data = await res.json();

        const sorted = data
          .map((item: any) => ({
            date: item.date,
            collected: item.collected,
          }))
          .sort(
            (a: ChartData, b: ChartData) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setChartData(sorted);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  if (loading) return <div>Loading chart...</div>;

  return <FinanceChart data={chartData} />;
}
