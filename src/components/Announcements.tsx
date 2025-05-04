"use server";

import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";
import { Prisma } from "@prisma/client";



const Messages = async ({ type = "ANNOUNCEMENT" }: { type?: "ANNOUNCEMENT" | "GENERAL" }) => {
  try {
    const { userId, role } = await fetchUserInfo();
    console.log("Messages Component Loaded");
    if (!userId || !role) {
      return <div>Error: Could not fetch user info</div>;
    }

    let classId: number | null = null;

    // Only if student, get their classId
    // If student, fetch classId from student table directly
    if (role === "student") {
      const student = await prisma.student.findUnique({
        where: { clerk_id: userId } as Prisma.StudentWhereUniqueInput,
        select: { classId: true },
      });

      if (!student) {
        return <div>Error: Student not found</div>;
      }

      // Get classId from student table
      classId = student?.classId ?? null;
    }

    const whereCondition: any = {
      type,
    };

    if (role !== "admin") {
      whereCondition.OR = [
        { classId: classId }, // student class
        { classId: null },     // school wide
      ];
    }

    const data = await prisma.messages.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: whereCondition,
      include: {
        Class: true,
      },
    });

    if (data.length === 0) {
      return <div>No announcements available</div>;
    }

    return (
      <div className="p-4 bg-white rounded-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Announcements</h1>
          <span className="text-xs text-gray-400">View All</span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {data.map((messages, index) => (
            <div key={messages.id} className={`p-4 rounded-md bg-${getColorForIndex(index)}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">
                  {messages.Class?.name ?? (type === "GENERAL" ? "General Message" : "Announcement")}
                </h2>
                <span className="px-1 py-1 text-xs text-black-500 bg-white rounded-md">
                  {new Intl.DateTimeFormat("en-GB").format(messages.date)}
                </span>
              </div>
              <p className="mt-1 text-sm text-black-500">{messages.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Error fetching announcements</div>;
  }
};



const getColorForIndex = (index: number) => {
  switch (index) {
    case 0: return "LamaSkyLight";
    case 1: return "LamaPurple";
    case 2: return "LamaYellow";
    default: return "white";
  }
};

export default Messages;
