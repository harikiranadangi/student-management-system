"use client";

import { SCHOOL_PERIODS, SATURDAY_PERIODS } from "@/lib/utils/periods";

type Lesson = {
  day: string;
  period: number | null;
  subject: string;
  teacher?: string;
  class?: string;
};

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const SUBJECT_COLORS = [
  { bg: "bg-[#EDF9FD]", text: "text-[#0C4A6E]" }, // LamaSkyLight / LamaSky
  { bg: "bg-[#F1F0FF]", text: "text-[#3B30A3]" }, // LamaPurpleLight / LamaPurple
  { bg: "bg-[#FEFCE8]", text: "text-[#594E00]" }, // LamaYellowLight / LamaYellow
];

export default function Timetable({ lessons }: { lessons: Lesson[] }) {
  const subjectColorMap: Record<string, { bg: string; text: string }> = {};
  let colorIndex = 0;
  lessons.forEach(l => {
    if (!subjectColorMap[l.subject]) {
      subjectColorMap[l.subject] = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];
      colorIndex++;
    }
  });

  const maxRows = SCHOOL_PERIODS.length;

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto border-collapse w-full text-sm shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-[#C3EBFA] via-[#CFCEFF] to-[#C3EBFA] text-[#0C4A6E] uppercase text-xs tracking-wider">
            <th className="border border-gray-300 p-3 text-left">Period</th>
            {DAYS.map(day => (
              <th key={day} className="border border-gray-300 p-3 text-left">{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => {
            const period = SCHOOL_PERIODS[rowIndex];
            const isBreakOrLunch = typeof period.id !== "number";

            if (isBreakOrLunch) {
              return (
                <tr key={`break-${rowIndex}`}>
                  <td
                    colSpan={DAYS.length + 1}
                    className="border border-gray-300 bg-gray-100 text-center italic font-semibold py-2"
                  >
                    {period.id === "lunch" ? "Lunch Break" : "Break"} ({period.start} - {period.end})
                  </td>
                </tr>
              );
            }

            return (
              <tr key={`period-${period.id}-${rowIndex}`} className="hover:bg-blue-50">
                <td className="border border-gray-300 p-3 font-semibold text-center">
                  Period {period.id}<br />
                  <span className="text-xs text-gray-500">{period.start} - {period.end}</span>
                </td>

                {DAYS.map(day => {
                  const isSaturday = day === "SATURDAY";
                  const periods = isSaturday ? SATURDAY_PERIODS : SCHOOL_PERIODS;
                  const periodData = periods[rowIndex];
                  if (!periodData || typeof periodData.id !== "number") return <td key={`${day}-${rowIndex}`} className="border border-gray-300"></td>;

                  const lessonData = lessons.find(l => l.day === day && l.period === periodData.id);

                  if (!lessonData) return <td key={`${day}-${periodData.id}`} className="border border-gray-300 text-center">-</td>;

                  const color = subjectColorMap[lessonData.subject];

                  return (
                    <td key={`${day}-${periodData.id}`} className="border border-gray-300 p-2">
                      <div className={`rounded-lg p-3 shadow-md ${color.bg} ${color.text} hover:scale-105 transition-transform duration-150`}>
                        <div className="font-semibold text-sm">{lessonData.subject}</div>
                        {lessonData.class && <div className="text-xs">{lessonData.class}</div>}
                        {lessonData.teacher && <div className="text-xs">{lessonData.teacher}</div>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
