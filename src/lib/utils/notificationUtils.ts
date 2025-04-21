// src/lib/utils/notificationUtils.ts
import prisma from "@/lib/prisma";
import { getMessageContent } from "./messageUtils";
import { MessageType } from "../../../types";

type CreateMessageInput = {
  studentId: string;
  date: string | Date;
  type: MessageType;
  classId: number;
};

export async function createStudentMessage({ studentId, date, type, classId }: CreateMessageInput) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      name: true,
      Class: {
        select: {
          name: true,
          Grade: {
            select: { level: true },
          },
        },
      },
    },
  });

  if (!student) return null;

  const className = `Grade ${student.Class?.Grade?.level ?? ""} - ${student.Class?.name ?? ""}`;
  const message = getMessageContent(type, {
    name: student.name,
    className,
  });

  return prisma.messages.create({
    data: {
      message,
      type,
      date: new Date(date).toISOString(),
      classId,
      studentId,
    },
  });
}
