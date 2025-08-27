"use client";
import Menu from "./Menu";
import { useActiveRole } from "@/hooks/useActiveRole";

export default function Sidebar() {
  const role = useActiveRole();

  if (!role) return <p>Loading menu...</p>;

  return <Menu role={role} />;
}
