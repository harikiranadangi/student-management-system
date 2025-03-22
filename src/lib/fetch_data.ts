import prisma from "./prisma";

export async function getStudentById(id: string) {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      Class: {
        include: {
          Teacher: true,
          _count: { select: { lessons: true } },
        },
      },
    },
  });
}

export async function getteacherById(id: string) {
    return await prisma.teacher.findUnique({
    where: { id },
    include: {
      class: { // ✅ Fetch the teacher's single assigned class
        select: {
          id: true,
          name: true,
          _count: { select: { students: true } }, // ✅ Get student count in the class
        },
      },
      _count: {
        select: {
          subjects: true,
          lessons: true,
        },
      },
    },
  });
}

const teacher = await prisma.teacher.findUnique({
  where: { clerk_id: clerkUser.clerk_id }, // Use the retrieved clerk_id
  include: {
    class: { // ✅ Fetch the teacher's single assigned class
      select: {
        id: true,
        name: true,
        _count: { select: { students: true } }, // ✅ Get student count in the class
      },
    },
    _count: {
      select: {
        subjects: true,
        lessons: true,
      },
    },
  },
});

if (!teacher) {
  return notFound();
}

// ✅ Get student count from the assigned class
const totalStudents = teacher.class?._count?.students ?? 0;
