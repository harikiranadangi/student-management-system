"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"; // ✅ use shadcn ui avatar
import { Check } from "lucide-react";

type Role = {
  id: string;
  username: string;
  name: string;
  className?: string;
  role: string;
  imageUrl?: string;
};

interface Props {
  roles: Role[];
  activeUsername?: string | null;
}

export default function SwitchUser({ roles, activeUsername }: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleSwitch(username: string) {
    startTransition(async () => {
      await fetch("/api/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      window.location.reload();
    });
  }

  const activeRole = roles.find((r) => r.username === activeUsername);

  return (
    <DropdownMenu>
      {/* Avatar Trigger */}
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full focus:outline-none shadow-md"
        >
          <Avatar className="w-10 h-10 ring-2 ring-gray-200">
            {activeRole?.imageUrl ? (
              <AvatarImage src={activeRole.imageUrl} alt={activeRole.name} />
            ) : (
              <AvatarFallback>{activeRole?.name?.[0] ?? "?"}</AvatarFallback>
            )}
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl shadow-lg border p-2 bg-white"
      >
        {roles.map((r) => {
          const isActive = r.username === activeUsername;
          return (
            <DropdownMenuItem
              key={r.id}
              onClick={() => handleSwitch(r.username)}
              disabled={isPending}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer 
                transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-50"
                }`}
            >
              <Avatar className="w-8 h-8 border">
                {r.imageUrl ? (
                  <AvatarImage src={r.imageUrl} alt={r.name} />
                ) : (
                  <AvatarFallback>{r.name[0]}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col flex-1">
                <span className="text-sm">{r.name}</span>
                <span className="text-xs text-gray-500">
                  {r.className ?? r.role}
                </span>
              </div>

              {isActive && <Check className="w-4 h-4 text-blue-600" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
