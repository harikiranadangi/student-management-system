"use client";

import { PERIOD_TIMINGS } from "@/lib/utils/periods";

type Lesson = {
  day: string;
  period: keyof typeof PERIOD_TIMINGS | null; // PERIOD1, PERIOD2, BREAK1...
  subject: string;
  teacher?: string;
  class: string | null;
};

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const SUBJECT_COLORS = [
  { bg: "bg-[#EDF9FD]", text: "text-[#0C4A6E]" }, // LamaSkyLight / LamaSky
  { bg: "bg-[#F1F0FF]", text: "text-[#3B30A3]" }, // LamaPurpleLight / LamaPurple
  { bg: "bg-[#FEFCE8]", text: "text-[#594E00]" }, // LamaYellowLight / LamaYellow
];

export default function Timetable({ lessons }: { lessons: Lesson[] }) {
  // Map subjects → consistent color
  const subjectColorMap: Record<string, { bg: string; text: string }> = {};
  let colorIndex = 0;
  lessons.forEach(l => {
    if (!subjectColorMap[l.subject]) {
      subjectColorMap[l.subject] = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];
      colorIndex++;
    }
  });

  // Get all defined periods (keys of PERIOD_TIMINGS)
  const periodKeys = Object.keys(PERIOD_TIMINGS) as (keyof typeof PERIOD_TIMINGS)[];

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto border-collapse w-full text-sm shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gradient-to-r from-[#C3EBFA] via-[#CFCEFF] to-[#C3EBFA] text-[#0C4A6E] dark:text-[#EDF9FD] uppercase text-xs tracking-wider">
            <th className="border border-gray-300 p-3 dark:text-gray-700 text-left">Period</th>
            {DAYS.map(day => (
              <th
                key={day}
                className="border border-gray-300 p-3 text-center align-middle dark:text-gray-700"
              >
                {day}
              </th>

            ))}
          </tr>
        </thead>

        <tbody>
          {periodKeys.map((periodKey) => {
            const { start, end } = PERIOD_TIMINGS[periodKey];
            const isBreakOrLunch = periodKey.startsWith("BREAK") || periodKey === "LUNCH";

            if (isBreakOrLunch) {
              return (
                <tr key={periodKey}>
                  <td
                    colSpan={DAYS.length + 1}
                    className="border border-gray-300 bg-gray-100 dark:bg-gray-700 text-center italic font-semibold py-2"
                  >
                    {periodKey === "LUNCH" ? "Lunch Break" : "Break"} ({start} - {end})
                  </td>
                </tr>
              );
            }

            return (
              <tr key={periodKey}>

                {/* Period column */}
                <td className="border border-gray-300 p-3 font-semibold text-center text-gray-800 dark:text-gray-200">
                  {periodKey.replace("PERIOD", "Period ")}<br />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{start} - {end}</span>
                </td>

                {/* Lessons by day */}
                {DAYS.map(day => {
                  const lessonData = lessons.find(l => l.day === day && l.period === periodKey);

                  if (!lessonData) {
                    return (
                      <td key={`${day}-${periodKey}`} className="border border-gray-300 text-center text-gray-500 dark:text-gray-400">-</td>
                    );
                  }

                  const color = subjectColorMap[lessonData.subject];

                  return (
                    <td key={`${day}-${periodKey}`} className="border border-gray-300 p-2">
                      <div
                        className={`rounded-lg p-3 shadow-md ${color.bg} ${color.text} hover:scale-105 transition-transform duration-150`}
                      >
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
