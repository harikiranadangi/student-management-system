import { startOfDay, endOfDay } from "date-fns";
import ClassFilterDropdown, { DateFilter } from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo, getClassIdForRole } from "@/lib/utils";
import { Class, Homework, Prisma } from "@prisma/client";
import Image from "next/image";
import SortButton from "@/components/SortButton";
import { SearchParams } from "../../../../../types";
import ResetFiltersButton from "@/components/ResetFiltersButton";

type Homeworks = Homework & { Class: Class };

const renderRow = (item: Homeworks, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td>
      {new Intl.DateTimeFormat("en-GB")
        .format(new Date(item.date))
        .replace(/\//g, "-")}
    </td>

    {(role === "admin" || role === "teacher") && (
      <td>{item.Class?.name ?? "N/A"}</td>
    )}

    <td className="flex items-center p-4">{item.description}</td>

    {(role === "admin" || role === "teacher") && (
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="homework" type="update" data={item} />
          <FormContainer table="homework" type="delete" id={item.id} />
        </div>
      </td>
    )}
  </tr>
);

const getColumns = (role: string | null) => {
  const baseColumns = [
    { header: "Date", accessor: "date" },
    { header: "Description", accessor: "description" },
  ];

  const adminTeacherColumns = [
    { header: "Class", accessor: "class" },
    { header: "Actions", accessor: "action" },
  ];

  return role === "admin" || role === "teacher"
    ? [
        ...baseColumns.slice(0, 1),
        adminTeacherColumns[0],
        ...baseColumns.slice(1),
        adminTeacherColumns[1],
      ]
    : baseColumns;
};

const HomeworkListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const { page, gradeId, classId, date, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  // Fetch user info and role
  const { role, userId } = await fetchUserInfo();
  const columns = getColumns(role);

  // Sorting
  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const sortKey = Array.isArray(params.sortKey)
    ? params.sortKey[0]
    : params.sortKey || "id";

  // Handle date
  const rawDate = Array.isArray(date) ? date[0] : date;
  const selectedDate = new Date(
    rawDate ?? new Date().toISOString().split("T")[0]
  );
  const selectedDateUTC = new Date(
    selectedDate.getUTCFullYear(),
    selectedDate.getUTCMonth(),
    selectedDate.getUTCDate()
  );
  const startDate = startOfDay(selectedDateUTC);
  const endDate = endOfDay(selectedDateUTC);

  // Get role-specific classIds
  const userClassIds = await getClassIdForRole(role, userId);

  // Build filters dynamically
  const filters: Prisma.HomeworkWhereInput = {
    date: { gte: startDate, lt: endDate },
    ...(userClassIds.length > 0
      ? { classId: { in: userClassIds } } // student or teacher
      : classId
      ? { classId: Number(classId) } // admin filter
      : {}),
    ...(gradeId ? { Class: { gradeId: Number(gradeId) } } : {}),
  };

  // Extra filters (search box, etc.)
  if (queryParams.search) {
    filters.OR = [
      { description: { contains: queryParams.search as string, mode: "insensitive" } },
      { Class: { name: { contains: queryParams.search as string, mode: "insensitive" } } },
    ];
  }

  // Fetch classes & grades
  const classes = await prisma.class.findMany();
  const grades = await prisma.grade.findMany();

  // Fetch data & count
  const [data, count] = await prisma.$transaction([
    prisma.homework.findMany({
      orderBy: [
        { [sortKey]: sortOrder },
        { id: "desc" }, // fallback sort
      ],
      where: filters,
      include: { Class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.homework.count({ where: filters }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Controls */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">Homeworks</h1>
        <div className="flex items-center gap-4">
          <DateFilter basePath="/list/homeworks" />
          {(role === "admin" || role === "teacher") && (
            <ClassFilterDropdown
              classes={classes}
              grades={grades}
              basePath="/list/homeworks"
            />
          )}
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <TableSearch />
            <ResetFiltersButton basePath="/list/homeworks" />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>

              <SortButton sortKey="id" />

              {(role === "admin" || role === "teacher") && (
                <FormContainer table="homework" type="create" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table
        columns={columns}
        renderRow={(item) => renderRow(item, role)}
        data={data}
      />

      {/* PAGINATION */}
      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default HomeworkListPage;
