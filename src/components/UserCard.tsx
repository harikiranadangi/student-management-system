import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({ type }: { type: "admin" | "teacher" | "student" }) => {

  let data: number;

  if (type === "student") {
    // Count only active students (you can replace 'ACTIVE' with your status value)
    data = await prisma.student.count({
      where: {
        status: "ACTIVE",
      },
    });
  } else if (type === "teacher") {
    data = await prisma.teacher.count();
  } else {
    data = await prisma.admin.count();
  }

  return (
    <div className="rounded-2xl odd:bg-LamaPurple even:bg-LamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="More" width={20} height={20} />
      </div>
      <h1 className="my-4 text-2xl font-semibold">{data}</h1>
      <h2 className="text-sm font-medium text-gray-500 capitalize">{type}s</h2>
    </div>
  );
};

export default UserCard;
