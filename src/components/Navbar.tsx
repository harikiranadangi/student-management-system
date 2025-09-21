import NavbarClient from "./NavbarClient";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function NavbarServer() {
  const user = await currentUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { clerk_id: user.id },
    include: {
      users: {
        include: {
          admin: true,
          teacher: true,
          student: { include: { Class: true } },
        },
      },
      activeUser: true,
    },
  });

  const roles = profile?.users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.admin?.name ?? u.teacher?.name ?? u.student?.name ?? u.username,
    className: u.student?.Class?.name ?? undefined,
    role: u.role,
  }));

  return (
    <NavbarClient
      roles={roles ?? []}
      activeUser={profile?.activeUser ? { username: profile.activeUser.username } : null}
    />
  );
}
