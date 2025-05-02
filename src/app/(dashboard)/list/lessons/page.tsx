export const dynamic = "force-dynamic";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { SearchParams } from "../../../../../types";

type LessonsList = Lesson & { subject: Subject } & { class: Class } & { teacher: Teacher };


const renderRow = (item: LessonsList, role: string | null) => (
  <tr
    key={item.id}
    className={`text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight`}
  >
    <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
    <td>{item.class.name}</td>
    <td className="hidden md:table-cell">{item.teacher.name}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" || role === "teacher" && (
          <>
            <FormContainer table="lesson" type="update" data={item} />
            <FormContainer table="lesson" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);


const getColumns = (role: string | null) => [
  {
    header: "Subject",
    accessor: "subject",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
      {
        header: "Actions",
        accessor: "action",
      },
    ]
    : []),
];

const LessonsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {

  // Fetch user info and role
  const {  role } = await fetchUserInfo();
  const columns = getColumns(role);  // Get dynamic columns

  // Await the searchParams first
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";
  
  
  // Initialize Prisma query object
  const query: Prisma.LessonWhereInput = {};

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      const val = Array.isArray(value) ? value[0] : value;
      if (val !== undefined) {
        switch (key) {
          case "classId":
            query.classId = parseInt(val);
            break;
          case "teacherId":
            query.teacherId = val;
            break;
          case "search":
            query.OR = [
              { Subject: { name: { contains: val } } },
              { Teacher: { name: { contains: val } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }
    

  // Fetch teachers and include related fields (subjects, classes)
  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      // orderBy: { [sortKey]: sortOrder },
      where: query,
      include: {
        Subject: { select: { name: true } },
        Class: { select: { name: true } },
        Teacher: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Lessons</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            
            {/* Sort by Class ID */}
            <SortButton sortKey="id" />
            
            {(role === "admin" || role === "teacher") && (<FormContainer 
            table="lesson" type="create" />)}
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

export default LessonsListPage;
