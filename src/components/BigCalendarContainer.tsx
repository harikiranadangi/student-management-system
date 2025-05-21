import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

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

  const rawSchedule = dataRes.map((lesson) => ({
    start: lesson.startTime,
    end: lesson.endTime,
    title:
      type === "teacherId"
        ? `${lesson.Class?.name ?? "Untitled"} - ${lesson.Subject?.name ?? "Unknown Class"}`
        : lesson.Subject?.name ?? "Untitled Lesson",
  }));

  const schedule = adjustScheduleToCurrentWeek(rawSchedule);

  return (
    <div className="container mx-auto p-4">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
