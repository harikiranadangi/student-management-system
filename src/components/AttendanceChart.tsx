"use client";

import Image from 'next/image';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', present: 1000, absent: 735 },
  { name: 'Tue', present: 1200, absent: 535 },
  { name: 'Wed', present: 1300, absent: 435 },
  { name: 'Thur', present: 1500, absent: 235 },
  { name: 'Fri', present: 1400, absent: 335 },
  { name: 'Sat', present: 1100, absent: 635 },
];
 
const AttendanceChart = () => {
  return (
    <div className='h-full p-4 bg-white rounded-lg'>
      <div>
        <h1>Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#8884d8" activeBar={<Rectangle fill='pink' stroke='blue'/>} />
          <Bar dataKey="absent" fill="#82ca9d" activeBar={<Rectangle fill='gold' stroke='purple' />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
