import prisma from "@/lib/prisma";
import Timetable from "./Timetable";

const TeacherTimetableContainer = async ({ teacherId }: { teacherId: string }) => {
  const lessons = await prisma.lesson.findMany({
    where: { teacherId },
    include: { Subject: true, Teacher: true, Class: true },
  });

  const mapped = lessons
    .map((lesson) => ({
      day: lesson.day, // LessonDay enum
      period: lesson.period,
      subject: lesson.Subject.name,
      class: lesson.Class.name, // show class for teacher timetable
      teacher: lesson.Teacher.name,
    }))
    .filter((l) => l.period !== null);

  return <Timetable lessons={mapped} />;
};

export default TeacherTimetableContainer;
