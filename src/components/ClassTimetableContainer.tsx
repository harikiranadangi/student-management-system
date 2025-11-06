import prisma from "@/lib/prisma";
import Timetable from "./Timetable";

const ClassTimetableContainer = async ({ classId }: { classId: number }) => {
  const lessons = await prisma.lesson.findMany({
    where: { classId },
    include: { Subject: true, Teacher: true, Class: true },
  });

  const mapped = lessons
    .map((lesson) => ({
      day: lesson.day, // LessonDay enum
      period: lesson.period,
      subject: lesson.Subject.name,
      teacher: lesson.Teacher.name,
      class: lesson.Class.name,
      
    }))
    .filter((l) => l.period !== null);

  return <Timetable lessons={mapped} />;
};

export default ClassTimetableContainer;
