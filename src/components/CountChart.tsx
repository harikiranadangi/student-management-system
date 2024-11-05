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

// Sample data for the chart
const data = [
  { name: "Total", count: 1735, fill: "white" },
  { name: "Female", count: 800, fill: "#FAE27C" },
  { name: "Male", count: 865, fill: "#C3EBFA" },
];

// Style for the Legend
const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = () => {
  return (
    <div className="w-full h-full p-4 bg-white rounded-xl">
      {/* TITLE */}
      <div className="flex items-center justify-between ">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      {/* CHART */}
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
        <Image src="/malefemale.png" alt="" width={70} height={70} className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"/>
      </div>
      {/* BOTTOM SECTION */}
      <div className='flex justify-center gap-16 '>
        <div className='flex flex-col items-center'>
        <div className='w-5 h-5 bg-black rounded-full' />
          <h1 className="font-bold">865</h1>
          <h2 className="text-xs text-gray-300">Boys (55%)</h2>
        </div>
        <div className='flex flex-col items-center'>
          <div className='w-5 h-5 rounded-full bg-lamaYellow' />
          <h1 className="font-bold">800</h1>  
          <h2 className="text-xs text-gray-300">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
