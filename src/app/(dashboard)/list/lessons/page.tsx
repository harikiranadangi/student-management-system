import prisma from "@/lib/prisma";
import ClassTimetableContainer from "@/components/ClassTimetableContainer";
import TeacherTimetableContainer from "@/components/TeacherTimetableContainer";
import ClassFilterDropdown from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import TeacherFilterDropdown from "@/components/dropdowns/teachers";
import ResetFiltersButton from "@/components/ResetFiltersButton";
import TableSearch from "@/components/TableSearch";

export const dynamic = "force-dynamic";

const LessonsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const classes = await prisma.class.findMany({ include: { Grade: true } });
  const grades = await prisma.grade.findMany();
  const teachers = await prisma.teacher.findMany();

  const classData = classes.map((cls) => ({
    id: cls.id,
    section: cls.section,
    gradeId: cls.Grade?.id ?? 0,
  }));

  const gradeData = grades.map((g) => ({ id: g.id, level: g.level }));
  const teacherData = teachers.map((t) => ({ id: t.id, name: t.name }));

  const selectedClassId = Number(
    Array.isArray(params?.classId) ? params?.classId[0] : params?.classId
  );

  const selectedTeacherId = Array.isArray(params?.teacherId)
    ? params?.teacherId[0]
    : params?.teacherId;

  const Path = "/list/lessons"

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold mb-6">Timetable</h1>

        {/* Filters + Form aligned */}
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <div className="flex flex-wrap gap-4">
            <TableSearch />
            {/* Teacher Dropdown (client component) */}
            <TeacherFilterDropdown teachers={teacherData} />
            {/* Class Dropdown */}
            <ClassFilterDropdown
              classes={classData}
              grades={gradeData}
              basePath={Path}
            />
            {/* Form on the right */}
            <FormContainer table="lesson" type="create" />
            <ResetFiltersButton basePath={Path} />
          </div>
        </div>
      </div>

      {/* Server-side Timetable */}
      {selectedTeacherId ? (
        <TeacherTimetableContainer teacherId={selectedTeacherId} />
      ) : (
        <ClassTimetableContainer
          classId={selectedClassId || classes[0]?.id || 1}
        />
      )}
    </div>
  );
};

export default LessonsListPage;
