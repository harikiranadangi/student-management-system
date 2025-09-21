import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({ type }: { type: "admin" | "teacher" | "student" }) => {
  let data: number;

  if (type === "student") {
    data = await prisma.student.count({ where: { status: "ACTIVE" } });
  } else if (type === "teacher") {
    data = await prisma.teacher.count();
  } else {
    data = await prisma.admin.count();
  }

  return (
    <div className="rounded-2xl p-4 flex-1 min-w-[130px] 
                    odd:bg-LamaPurple even:bg-LamaYellow 
                    text-black">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Badge */}
        <span className="text-[10px] px-2 py-1 rounded-full bg-white text-green-600 font-semibold">
          2024/25
        </span>

        {/* More Icon */}
        <Image src="/more.png" alt="More" width={20} height={20} />
      </div>

      {/* Count */}
      <h1 className="my-4 text-2xl font-semibold text-black">{data}</h1>

      {/* Label */}
      <h2 className="text-sm font-medium capitalize text-black">{type}s</h2>
    </div>
  );
};

export default UserCard;
