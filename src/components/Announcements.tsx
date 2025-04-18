"use server";

import prisma from "@/lib/prisma";
import { fetchUserInfo } from "@/lib/utils";

const Announcements = async () => {
  try {
    const { userId, role } = await fetchUserInfo();
    if (!userId || !role) {
      return <div>Error: Could not fetch user info</div>;
    }

    const roleConditions = {
      teacher: { lessons: { some: { teacherId: userId } } },
      student: { students: { some: { id: userId } } },
    };
    
    const data = await prisma.announcement.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: {
        ...(role !== "admin" && {
          OR: [
            // Class-specific announcements based on role
            { Class: roleConditions[role as keyof typeof roleConditions] || {} },
            // Global announcements
            { classId: null },
          ],
        }),
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
          {data.map((announcement, index) => (
            <div key={announcement.id} className={`p-4 rounded-md bg-${getColorForIndex(index)}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{announcement.title}</h2>
                <span className="px-1 py-1 text-xs text-black-500 bg-white rounded-md">
                  {new Intl.DateTimeFormat("en-GB").format(announcement.date)}
                </span>
              </div>
              <p className="mt-1 text-sm text-black-500">{announcement.description}</p>
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

export default Announcements;
