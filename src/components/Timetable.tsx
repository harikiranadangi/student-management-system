"use client";

import { SCHOOL_PERIODS } from "@/lib/utils/periods";

type Lesson = {
  day: string; // "MONDAY" | "TUESDAY" | ... | "SATURDAY"
  period: number | null;
  subject: string;
  teacher?: string;
  class?: string;
};

// ✅ Now includes Saturday
const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export default function Timetable({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Period</th>
            {DAYS.map((day) => (
              <th key={day} className="border border-gray-300 p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHOOL_PERIODS.map((p) => (
            <tr key={p.id}>
              <td className="border border-gray-300 p-2 font-semibold text-center">
                {typeof p.id === "number"
                  ? `Period ${p.id}`
                  : p.id === "lunch"
                  ? "Lunch Break"
                  : "Break"}
                <br />
                <span className="text-xs text-gray-500">
                  {p.start} - {p.end}
                </span>
              </td>

              {DAYS.map((day) => {
                if (typeof p.id !== "number") {
                  return (
                    <td
                      key={`${day}-${p.id}`}
                      className="border border-gray-300 bg-gray-100 text-center italic"
                    >
                      {p.id === "lunch" ? "Lunch" : "Break"}
                    </td>
                  );
                }

                const lesson = lessons.find(
                  (l) => l.day === day && l.period === p.id
                );

                return (
                  <td
                    key={`${day}-${p.id}`}
                    className="border border-gray-300 p-2 text-center"
                  >
                    {lesson ? (
                      <div>
                        <div className="font-medium">{lesson.subject}</div>
                        {lesson.class && (
                          <div className="text-xs text-gray-600">
                            {lesson.class}
                          </div>
                        )}
                        {lesson.teacher && (
                          <div className="text-xs text-gray-600">
                            {lesson.teacher}
                          </div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
