// lib/utils/getTodayLessonDay.ts
import { LessonDay } from "@prisma/client";

export const getTodayLessonDay = (): LessonDay => {
  const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  
  // Map so Monday = 1, Sunday = 7
  const map: Record<number, LessonDay> = {
    0: LessonDay.SUNDAY,    // 7th day
    1: LessonDay.MONDAY,    // 1st day
    2: LessonDay.TUESDAY,
    3: LessonDay.WEDNESDAY,
    4: LessonDay.THURSDAY,
    5: LessonDay.FRIDAY,
    6: LessonDay.SATURDAY,
  };

  return map[dayIndex];
};
