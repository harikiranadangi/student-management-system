"use client";
import { useState } from "react";

// Define a Role type (matching your Prisma Role model)
type Role = {
  id: number;
  role: string;
  username: string;
};

interface RoleSwitcherProps {
  roles: Role[];
  activeRoleId: number | null;
}

export default function RoleSwitcher({ roles, activeRoleId }: RoleSwitcherProps) {
  const [loading, setLoading] = useState(false);

  async function switchRole(roleId: number) {
    setLoading(true);
    await fetch("/api/switch-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId }),
    });
    setLoading(false);
    window.location.reload(); // reload with new active role
  }

  return (
    <select
      value={activeRoleId ?? ""}
      onChange={(e) => switchRole(Number(e.target.value))}
      disabled={loading}
      className="p-2 rounded border"
    >
      <option value="" disabled>
        Switch Role
      </option>
      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.role.toUpperCase()} ({r.username})
        </option>
      ))}
    </select>
  );
}
