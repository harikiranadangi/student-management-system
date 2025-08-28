"use client";
import { useTransition } from "react";

type Role = {
  id: string;         // LinkedUser.id (not used for switching)
  username: string;   // used for switching
  name: string;       // display name (from Admin/Teacher/Student)
  className?: string; // optional for students
  role: string;       // LinkedUser.type
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

  return (
    <select
      className="px-2 py-1 text-sm border rounded"
      value={activeUsername ?? ""}
      onChange={(e) => handleSwitch(e.target.value)}
      disabled={isPending}
    >
      {roles.map((r) => (
        <option key={r.id} value={r.username}>
          {r.name} {r.className ? `(${r.className})` : ""}
        </option>
      ))}
    </select>
  );
}
