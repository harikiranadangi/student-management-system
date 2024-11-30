"use client";
import React from "react";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { count } from "console";


const CountChart = ({ male, female }: { male: number; female: number}) => {
  
  // Sample data for the chart
  const data = [
    { name: "Total", count: male+female, fill: "white" },
    { name: "Female", count: male, fill: "#FAE27C" },
    { name: "Male", count: female, fill: "#C3EBFA" },
  ];
  
  // Style for the Legend
  const style = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };
  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={28}
          data={data}
        >
          <RadialBar
            background
            dataKey="count"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src="/malefemale.png" alt="" width={70} height={70} className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
    </div>

  );
};

export default CountChart;
