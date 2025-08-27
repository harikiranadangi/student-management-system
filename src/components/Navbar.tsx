import { UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import SwitchUser from "./SwitchUser";

const Navbar = async () => {
  const user = await currentUser();

  if (!user) return null;

  // 🗄️ Fetch the profile + roles from Prisma
  const profile = await prisma.profile.findUnique({
    where: { clerk_id: user.id },
    include: { users: true, activeUser: true },
  });

  if (!profile) {
    return (
      <div className="flex items-center justify-between px-3 py-4 bg-white shadow-sm">
        <span className="text-sm text-gray-500">No profile found</span>
        <UserButton />
      </div>
    );
  }

  const roles = profile.users.map((u) => ({
    id: u.id,
    username: u.username,
    role: u.role,
  }));

  return (
    <div className="flex items-center justify-between px-3 py-4 bg-white shadow-sm">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="Search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center justify-end w-full gap-6">
        <div className="flex items-center justify-center bg-white rounded-full cursor-pointer w-7 h-7">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>

        <div className="relative flex items-center justify-center bg-white rounded-full cursor-pointer w-7 h-7">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-purple-500 rounded-full -top-3 -right-3">
            1
          </div>
        </div>

        {/* ✅ Role switcher */}
        <SwitchUser roles={roles} activeUserId={profile.activeUserId} />

        <div className="flex flex-col">
          <span className="text-xs font-medium leading-3">{user.fullName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {profile.activeUser?.role ?? "No role"}
          </span>
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
