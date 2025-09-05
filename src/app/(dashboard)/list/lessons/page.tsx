export const dynamic = "force-dynamic";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo, getClassIdForRole } from "@/lib/utils";
import { Class, Lesson, LessonDay, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { SearchParams } from "../../../../../types";
import ResetFiltersButton from "@/components/ResetFiltersButton";
import ClassFilterDropdown, { DayFilter } from "@/components/FilterDropdown";

type LessonsList = Pick<Lesson, "id" | "startTime" | "endTime"> & {
  subject: Pick<Subject, "name">;
  class: Pick<Class, "name">;
  teacher: Pick<Teacher, "name">;
};

const renderRow = (item: LessonsList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td>{item.class.name}</td>
    <td className="flex items-center gap-4 p-4">{item.subject?.name}</td>
    <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString()}</td>
    <td className="hidden md:table-cell">{item.endTime.toLocaleTimeString()}</td>
    <td className="hidden md:table-cell">{item.teacher.name}</td>
    <td>
      {(role === "admin" || role === "teacher") && (
        <div className="flex items-center gap-2">
          <FormContainer table="lesson" type="update" data={item} />
          <FormContainer table="lesson" type="delete" id={item.id} />
        </div>
      )}
    </td>
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Class", accessor: "class" },
  { header: "Subject", accessor: "subject" },
  { header: "Start Time", accessor: "startTime" },
  { header: "End Time", accessor: "endTime" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  ...(role === "admin" || role === "teacher"
    ? [{ header: "Actions", accessor: "action" }]
    : []),
];

const LessonsListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const page = params.page ? (Array.isArray(params.page) ? params.page[0] : params.page) : "1";

  // Fetch user info
  const { role, userId } = await fetchUserInfo();
  const columns = getColumns(role);

  // Base query
  const query: Prisma.LessonWhereInput = {};

  // Role-based access: students & teachers only see their grades/classes
  if (role === "student" && userId) {
    const classIds = await getClassIdForRole(role, userId);
    query.classId = { in: classIds };
  }
  if (role === "teacher" && userId) {
    const teacherClasses = await prisma.class.findMany({
      where: { supervisorId: userId },
      select: { id: true },
    });
    query.classId = { in: teacherClasses.map((cls) => cls.id) };
  }

  // Day filter (optimize by enum)
  if (params.day) {
    const dayStr = Array.isArray(params.day) ? params.day[0] : params.day;
    const upperDay = dayStr.toUpperCase() as keyof typeof LessonDay;
    if (LessonDay[upperDay]) query.day = LessonDay[upperDay];
  }

  // Optional filters
  if (params.classId) query.classId = Number(Array.isArray(params.classId) ? params.classId[0] : params.classId);
  if (params.teacherId) query.teacherId = Array.isArray(params.teacherId) ? params.teacherId[0] : params.teacherId;
  if (params.search) {
    const search = Array.isArray(params.search) ? params.search[0] : params.search;
    query.OR = [
      { Subject: { name: { contains: search, mode: "insensitive" } } },
      { Teacher: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  // Fetch lessons + count in a single transaction
  const [lessonsRaw, totalCount] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        Subject: { select: { name: true } },
        Class: { select: { name: true } },
        Teacher: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(page) - 1),
      orderBy: { startTime: "asc" },
    }),
    prisma.lesson.count({ where: query }),
  ]);

  const lessons: LessonsList[] = lessonsRaw.map((l) => ({
    ...l,
    subject: l.Subject,
    class: l.Class,
    teacher: l.Teacher,
  }));

  const Path = "/list/lessons";
  // Fetch dropdowns
  const classes = await prisma.class.findMany({ include: { Grade: true } });
  const grades = await prisma.grade.findMany();

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Lessons</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <DayFilter basePath={Path}/>
          <ClassFilterDropdown classes={classes} grades={grades} basePath={Path}/>
          <ResetFiltersButton basePath={Path}/>
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <SortButton sortKey="id" />
            {(role === "admin" || role === "teacher") && <FormContainer table="lesson" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={lessons} />
      <Pagination page={parseInt(page)} count={totalCount} />
    </div>
  );
};

export default LessonsListPage;
