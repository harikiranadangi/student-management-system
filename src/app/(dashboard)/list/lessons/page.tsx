import prisma from "@/lib/prisma";
import ClassTimetableContainer from "@/components/ClassTimetableContainer";
import ClassFilterDropdown, { DayFilter } from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";

export const dynamic = "force-dynamic";

const LessonsListPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const params = await searchParams; // ✅ Await it

  const classes = await prisma.class.findMany({ include: { Grade: true } });
  const grades = await prisma.grade.findMany();

  const classData = classes.map((cls) => ({
    id: cls.id,
    section: cls.section, // ✅ fixed
    gradeId: cls.Grade?.id ?? 0,
  }));

  const gradeData = grades.map((g) => ({ id: g.id, level: g.level }));

  const selectedClassId =
    Number(
      Array.isArray(params?.classId)
        ? params?.classId[0]
        : params?.classId
    ) || classes[0]?.id || 1;

  const Path = "/list/lessons";

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <h1 className="text-lg font-semibold mb-6">Timetable</h1>

      {/* Filters + Form aligned */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex flex-wrap gap-4">
          <ClassFilterDropdown
            classes={classData}
            grades={gradeData}
            basePath={Path}
          />
        </div>

        {/* Form on the right */}
        <FormContainer table="lesson" type="create" />
      </div>

      {/* Server-side Timetable */}
      <ClassTimetableContainer classId={selectedClassId} />
    </div>
  );
};

export default LessonsListPage;
