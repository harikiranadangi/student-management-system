// /api/classes.ts

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const classes = await prisma.class.findMany({ select: { id: true, name: true } });
  res.json(classes);
}
