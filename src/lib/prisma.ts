import { PrismaClient } from "@prisma/client";

// Base client (unextended) so we can safely call it from inside extensions
const basePrismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "warn" },
    ],
  });
};

declare const globalThis: {
  prismaBaseGlobal: ReturnType<typeof basePrismaClientSingleton>;
  prismaGlobal: PrismaClient;
} & typeof global;

// Reuse base client in dev to avoid exhausting connections
const base = globalThis.prismaBaseGlobal ?? basePrismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prismaBaseGlobal = base;

// Extend with query hooks
const prisma = (globalThis.prismaGlobal ??
  base.$extends({
    query: {
      class: {
        // ✅ Auto-set name on create: "<gradeLevel> - <section>"
        async create({ args, query }) {
          const d = args.data as { gradeId?: number; section?: string; name?: string };

          if (d.gradeId && d.section) {
            const grade = await base.grade.findUnique({
              where: { id: d.gradeId },
              select: { level: true },
            });

            if (grade?.level) {
              // ✅ Consistent format: "10 - A"
              d.name = `${grade.level} - ${d.section}`;
              console.log("✅ Auto name generated:", d.name);

              // 🚫 Prevent duplicates before inserting
              const existing = await base.class.findFirst({
                where: { gradeId: d.gradeId, section: d.section },
              });
              if (existing) {
                throw new Error(`Duplicate class "${d.name}" already exists.`);
              }
            }
          }

          return query(args);
        },

        // ✅ Auto-update name when gradeId or section changes
        async update({ args, query }) {
          const d = args.data as { gradeId?: number; section?: string; name?: string };
          let gradeId = d.gradeId;
          let section = d.section;

          // If one is missing, read from existing record
          if (!gradeId || !section) {
            const existing = await base.class.findUnique({
              where: args.where as any,
              select: { gradeId: true, section: true },
            });
            gradeId ??= existing?.gradeId;
            section ??= existing?.section ?? undefined;
          }

          // Compute new name and prevent duplicates
          if (gradeId && section) {
            const grade = await base.grade.findUnique({
              where: { id: gradeId },
              select: { level: true },
            });

            if (grade?.level) {
              // ✅ Ensure proper spacing
              const newName = `${grade.level} - ${section}`;

              // 🚫 Prevent duplicates on update (ignore self)
              const duplicate = await base.class.findFirst({
                where: {
                  gradeId,
                  section,
                  NOT: args.where,
                },
              });
              if (duplicate) {
                throw new Error(`Cannot rename — class "${newName}" already exists.`);
              }

              d.name = newName;
            }
          }

          return query(args);
        },
      },
    },
  })) as PrismaClient;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// ⚠️ Slow query logger
base.$on("query", (e) => {
  if (e.duration > 100) {
    console.warn(`⚠️ Slow Query (${e.duration}ms): ${e.query}`);
  }
});

export default prisma;
