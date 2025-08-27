"use client";
import { useTransition } from "react";

type Role = {
  id: string;              // 👈 Prisma LinkedUser.id is String
  username: string;
  role: string;            // maps to LinkedUser.type
};

interface Props {
  roles: Role[];
  activeUserId?: string | null;   // 👈 match schema
}

export default function SwitchUser({ roles, activeUserId }: Props) {
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
      value={roles.find((r) => r.id === activeUserId)?.username ?? ""}
      onChange={(e) => handleSwitch(e.target.value)}
      disabled={isPending}
    >
      {roles.map((r) => (
        <option key={r.id} value={r.username}>
          {r.username} ({r.role})
        </option>
      ))}
    </select>
  );
}
