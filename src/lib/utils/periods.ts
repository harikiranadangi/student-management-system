import moment from "moment";

export const SCHOOL_PERIODS = [
  { id: 1, start: "09:00", end: "10:00" },
  { id: 2, start: "10:01", end: "10:40" },
  { id: "break1", start: "10:41", end: "10:50" },
  { id: 3, start: "10:51", end: "11:30" },
  { id: 4, start: "11:31", end: "12:30" },
  { id: "lunch", start: "12:30", end: "13:10" },
  { id: 5, start: "13:11", end: "14:00" },
  { id: 6, start: "14:01", end: "14:40" },
  { id: "break2", start: "14:41", end: "14:50" },
  { id: 7, start: "14:51", end: "15:30" },
  { id: 8, start: "15:31", end: "16:10" },
] as const;

// Half-day periods for Saturday
export const SATURDAY_PERIODS = [
  { id: 1, start: "09:00", end: "10:00" },
  { id: 2, start: "10:01", end: "10:40" },
  { id: "break1", start: "10:41", end: "10:50" },
  { id: 3, start: "10:51", end: "11:30" },
  { id: 4, start: "11:31", end: "12:30" },
  { id: 5, start: "12:31", end: "13:10" }, // last period ends by 1:10
  
] as const;

// Narrow type to only numeric periods
type NumericPeriod = Extract<(typeof SCHOOL_PERIODS)[number]["id"], number>;

/**
 * Get numeric period from a date
 * @param date Date object
 * @param isSaturday boolean to choose Saturday periods
 * @returns NumericPeriod | null
 */
export function getPeriodFromStartTime(date: Date, isSaturday = false): NumericPeriod | null {
  const time = moment(date).format("HH:mm");
  const periods = isSaturday ? SATURDAY_PERIODS : SCHOOL_PERIODS;

  const period = periods.find(
    (p) => typeof p.id === "number" && time >= p.start && time <= p.end
  );
  return (period?.id as NumericPeriod) ?? null;
}
