"use server";

import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import clsx from "clsx";

const Messages = async ({ type = "ANNOUNCEMENT" }: { type?: "ANNOUNCEMENT" | "GENERAL" }) => {
  try {
    const { userId, role } = await fetchUserInfo();
    if (!userId || !role) return <div>Error: Could not fetch user info</div>;

    let classId: number | null = null;

    // Get student's class if role is student
    if (role === "student") {
      const student = await prisma.student.findUnique({
        where: { clerk_id: userId } as Prisma.StudentWhereUniqueInput,
        select: { classId: true },
      });

      if (!student) return <div>Error: Student not found</div>;

      classId = student.classId ?? null;
    }

    const whereCondition: Prisma.MessagesWhereInput = {
      type,
      ...(role !== "admin" && {
        OR: [
          { classId: classId ?? undefined },
          { classId: null }, // school-wide
        ],
      }),
    };

    const data = await prisma.messages.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: whereCondition,
      include: {
        Class: true,
      },
    });

    if (data.length === 0) return <div>No announcements available</div>;

    return (
      <div className="p-4 bg-white rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Announcements</h1>
          <span className="text-xs text-gray-400 cursor-pointer">View All</span>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {data.map((msg, index) => (
            <div
              key={msg.id}
              className={clsx("p-4 rounded-md", {
                "bg-LamaSkyLight": index === 0,
                "bg-LamaPurple": index === 1,
                "bg-LamaYellow": index === 2,
              })}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">
                  {msg.Class?.name ?? (type === "GENERAL" ? "General Message" : "School-wide")}
                </h2>
                <span className="px-1 py-1 text-xs text-black-500 bg-white rounded-md">
                  {new Intl.DateTimeFormat("en-GB").format(msg.date)}
                </span>
              </div>
              <p className="mt-1 text-sm text-black-500">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading messages:", error);
    return <div>Error fetching announcements</div>;
  }
};

export default Messages;
