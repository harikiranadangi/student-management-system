"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({
  data,
  darkMode = false,
}: {
  data: { name: string; present: number; absent: number }[];
  darkMode?: boolean;
}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={20}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
          horizontal={true}
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{
            fill: darkMode ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
          }}
          tickLine={false}
        />

        <YAxis
          axisLine={false}
          tick={{
            fill: darkMode ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
          }}
          tickLine={false}
        />



        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            borderColor: darkMode ? "rgba(255,255,255,0.2)" : "lightgray",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#f9fafb" : "#000",
          }}
        />

        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{
            paddingTop: "20px",
            paddingBottom: "40px",
            color: darkMode ? "#f9fafb" : "#374151", // gray-700 in light mode
          }}
        />

        <Bar
          dataKey="present"
          fill="#FAE27C"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="absent"
          fill="#C3EBFA"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
