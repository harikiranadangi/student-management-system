import { auth } from "@clerk/nextjs/server";

export async function getRole(): Promise<string | null> {
  try {
    const { sessionClaims, userId } = await auth();

    console.log("User ID:", userId); 

    interface SessionMetadata {
      role?: string;
    }

    return (sessionClaims?.metadata as SessionMetadata)?.role || null;
  } catch (error) {
    console.error("Failed to fetch role:", error);
    return null;
  }
}

const currentWorkWeek = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfweek = new Date(today);

  if (dayOfWeek === 0) {
    startOfweek.setDate(today.getDate() + 1);
  } else {
    startOfweek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfweek.setHours(0, 0, 0, 0);

  return startOfweek;
};

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfweek = currentWorkWeek();

  return lessons.map((lesson) => {
    if (!lesson.start || !lesson.end) {
      throw new Error(`Lesson start or end date is invalid: ${JSON.stringify(lesson)}`);
    }

    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfweek);
    adjustedStartDate.setDate(startOfweek.getDate() + daysFromMonday);
    
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedStartDate.setHours(lesson.start.getHours(), lesson.start.getMinutes(), lesson.start.getSeconds());
    adjustedEndDate.setHours(lesson.end.getHours(), lesson.end.getMinutes(), lesson.end.getSeconds());

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
