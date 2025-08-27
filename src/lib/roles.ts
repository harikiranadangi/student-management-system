// src/lib/roles.ts
export type Role = "student" | "teacher" | "admin";

export function ensureRole(rawRole: unknown): Role {
  if (rawRole === "student" || rawRole === "teacher" || rawRole === "admin") {
    return rawRole;
  }
  return "student"; // fallback
}
