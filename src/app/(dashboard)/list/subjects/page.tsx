export const dynamic = "force-dynamic";
import ClassFilterDropdown from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils/server-utils";
import { Grade, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { SearchParams } from "../../../../../types";
import ResetFiltersButton from "@/components/ResetFiltersButton";

type SubjectListType = Subject & {
  grades: Grade[];
  teachers: { teacher: Teacher }[]; // Assuming SubjectTeacher relation here
};

const renderRow = (item: SubjectListType, role: string | null) => {
  const gradeLevels = item.grades.map(gradeSubject => gradeSubject.level || "Unknown").join(", ");

  return (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        {item.name}
      </td>
      <td className="hidden md:table-cell">
        {gradeLevels}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const getColumns = (role: string | null) => [
  {
    header: "Subject",
    accessor: "name",
  },
  {
    header: "Grades",
    accessor: "grades",
  },
  ...(role === "admin"
    ? [
      {
        header: "Actions",
        accessor: "action",
      },
    ]
    : []),
];

const SubjectList = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { role } = await fetchUserInfo();



  const params = await searchParams;
  const { page, gradeId, classId, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  const columns = getColumns(role);

  // Get sorting order and column from URL
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = Array.isArray(params.sortKey) ? params.sortKey[0] : params.sortKey || "name";



  const query: Prisma.SubjectWhereInput = {};


  // Filter by gradeId directly on the subjects
  if (gradeId) {
    query.grades = { some: { id: Number(gradeId) } }; // Filter subjects where related grade has the given gradeId
  }

  // Filter by classId through the grades model
  if (classId) {
    query.grades = {
      some: {
        classes: {
          some: {
            id: Number(classId), // Filter grades where the related class matches the given classId
          },
        },
      },
    };
  }

  // Fetch classes list (for dropdown etc.)
  const classes = await prisma.class.findMany({
    where: gradeId ? { gradeId: Number(gradeId) } : {},
  });

  // Fetch grades list
  const grades = await prisma.grade.findMany();



  if (queryParams.search) {
    const searchValue = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;
    query.OR = [
      { name: { contains: searchValue, mode: "insensitive" } },
      { grades: { some: { level: { contains: searchValue, mode: "insensitive" } } } }, // Assuming grades have a 'level' field
      { teachers: { some: { teacher: { name: { contains: searchValue, mode: "insensitive" } } } } }, // Assuming teachers have a 'name' field
    ]
  }



  // Fetch data with the updated query
  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      orderBy: [
        { [sortKey]: sortOrder },  // Dynamic sorting (based on user selection)
        { name: "asc" },  // Default multi-column sorting        
      ],
      where: query,
      include: {
        grades: {
          include: {
            classes: true, // Include classes to help with filtering
          },
        },
        teachers: {
          include: {
            teacher: {
              select: {
                name: true, // Include teacher names
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Subjects ({count})</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <ClassFilterDropdown classes={classes} grades={grades} basePath="/list/subjects" />
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <TableSearch />
            {/* 🔄 Reset Filters Button */}
            <ResetFiltersButton basePath="/list/subjects" />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && (
                <FormContainer table="subject" type="create" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIST: Description */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      {/* PAGINATION: Description */}
      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default SubjectList;
