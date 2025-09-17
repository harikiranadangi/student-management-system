import moment from "moment";

export const SCHOOL_PERIODS = [
  { id: 1, start: "09:00", end: "09:50" },
  { id: 2, start: "09:51", end: "10:30" },
  { id: "break1", start: "10:31", end: "10:40" },
  { id: 3, start: "10:41", end: "11:20" },
  { id: 4, start: "11:21", end: "12:20" },
  { id: "lunch", start: "12:30", end: "13:10" },
  { id: 5, start: "13:11", end: "14:00" },
  { id: 6, start: "14:01", end: "14:40" },
  { id: "break2", start: "14:41", end: "14:50" },
  { id: 7, start: "14:51", end: "15:30" },
  { id: 8, start: "15:31", end: "16:10" },
] as const;

// 👇 This narrows to only numbers
type NumericPeriod = Extract<(typeof SCHOOL_PERIODS)[number]["id"], number>;

export function getPeriodFromStartTime(date: Date): NumericPeriod | null {
  const time = moment(date).format("HH:mm");
  const period = SCHOOL_PERIODS.find(
    (p) => typeof p.id === "number" && time >= p.start && time <= p.end
  );
  return (period?.id as NumericPeriod) ?? null;
}
