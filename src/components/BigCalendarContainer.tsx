import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import moment from "moment";

const SCHOOL_PERIODS = [
  { start: "09:00", end: "09:50" },
  { start: "09:51", end: "10:30" },
  { start: "10:31", end: "10:40", break: true }, // Short Break
  { start: "10:41", end: "11:20" },
  { start: "11:21", end: "12:20" },
  { start: "12:30", end: "13:10", lunch: true }, // Lunch Break
  { start: "13:11", end: "14:00" },
  { start: "14:01", end: "14:50" },
  { start: "14:51", end: "15:30" },
  { start: "15:31", end: "16:10" },
];

const mapToPeriod = (lesson: any, type: "teacherId" | "classId") => {
  const lessonStart = moment(lesson.startTime).format("HH:mm");

  const matchedPeriod = SCHOOL_PERIODS.find(
    (p) => !p.break && !p.lunch && lessonStart >= p.start && lessonStart <= p.end
  );

  if (!matchedPeriod) return null;

  const today = new Date();
  const start = moment(
    `${today.toDateString()} ${matchedPeriod.start}`
  ).toDate();
  const end = moment(
    `${today.toDateString()} ${matchedPeriod.end}`
  ).toDate();

  return {
    start,
    end,
    title:
      type === "teacherId"
        ? `${lesson.Class?.name ?? "Untitled"} - ${
            lesson.Subject?.name ?? "Unknown Class"
          }`
        : lesson.Subject?.name ?? "Untitled Lesson",
  };
};

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
    include: {
      Subject: true,
      Class: true,
    },
  });

  // Map actual lessons into school periods
  const rawSchedule = dataRes
    .map((lesson) => mapToPeriod(lesson, type))
    .filter((event) => event !== null);

  // Add breaks & lunch into schedule
  const today = new Date();
  const breaks = SCHOOL_PERIODS.filter((p) => p.break || p.lunch).map((p) => ({
    start: moment(`${today.toDateString()} ${p.start}`).toDate(),
    end: moment(`${today.toDateString()} ${p.end}`).toDate(),
    title: p.break ? "Break" : "Lunch Break",
  }));

  const schedule = adjustScheduleToCurrentWeek([...rawSchedule, ...breaks]);

  return (
    <div className="container mx-auto p-4">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
