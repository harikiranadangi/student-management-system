"use client";

import Image from "next/image";
import SwitchUser from "./SwitchUser";
import ThemeToggle from "./ThemeToggle";

interface NavbarClientProps {
  roles: Array<{
    id: string;
    username: string;
    name: string;
    className?: string;
    role: string;
  }>;
  activeUser: { username?: string } | null;
}

export default function NavbarClient({ roles, activeUser }: NavbarClientProps) {
  return (
    <div className="flex items-center justify-between px-3 py-4 bg-white dark:bg-gray-800 shadow-md">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-600 px-2 bg-gray-50 dark:bg-gray-700">
        <Image src="/search.png" alt="Search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
        />
      </div>

      {/* ICONS + USER */}
      <div className="flex items-center justify-end w-full gap-4 md:gap-6">
        {/* Messages */}
        <div className="flex items-center justify-center bg-gray-100 dark:bg-LamaPurple rounded-full cursor-pointer w-8 h-8 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>

        {/* Announcements */}
        <div className="relative flex items-center justify-center bg-gray-100 dark:bg-LamaPurple rounded-full cursor-pointer w-8 h-8 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-LamaPurple rounded-full -top-2 -right-2 shadow-md">
            1
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Role switcher */}
        <SwitchUser roles={roles} activeUsername={activeUser?.username ?? null} />
      </div>
    </div>
  );
}
