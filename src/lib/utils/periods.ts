import { Period } from "@prisma/client";

// All school periods (Mon–Fri full day)
export const PERIOD_TIMINGS: Record<Period, { start: string; end: string }> = {
  PERIOD1: { start: "09:00", end: "10:00" },
  PERIOD2: { start: "10:01", end: "10:40" },
  BREAK1: { start: "10:41", end: "10:50" },
  PERIOD3: { start: "10:51", end: "11:30" },
  PERIOD4: { start: "11:31", end: "12:30" },
  LUNCH: { start: "12:30", end: "13:10" },
  PERIOD5: { start: "13:11", end: "14:00" },
  PERIOD6: { start: "14:01", end: "14:40" },
  BREAK2: { start: "14:41", end: "14:50" },
  PERIOD7: { start: "14:51", end: "15:30" },
  PERIOD8: { start: "15:31", end: "16:10" },
};

// Half-day schedule for Saturday
export const SATURDAY_PERIODS: Period[] = [
  "PERIOD1",
  "PERIOD2",
  "BREAK1",
  "PERIOD3",
  "PERIOD4",
  "PERIOD5", // Ends at 1:10
];

/**
 * Convert "HH:mm" to total minutes for comparison
 */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Get current period enum from a Date
 */
export function getPeriodFromStartTime(
  date: Date,
  isSaturday = false
): Period | null {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const periods = isSaturday ? SATURDAY_PERIODS : (Object.keys(PERIOD_TIMINGS) as Period[]);

  for (const period of periods) {
    const { start, end } = PERIOD_TIMINGS[period];
    const startMins = toMinutes(start);
    const endMins = toMinutes(end);

    if (currentMinutes >= startMins && currentMinutes <= endMins) {
      return period;
    }
  }

  return null;
}
