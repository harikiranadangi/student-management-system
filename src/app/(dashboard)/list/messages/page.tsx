import { Class, Messages, Prisma, Student } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo, getClassIdForRole } from "@/lib/utils";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import SortButton from "@/components/SortButton";
import { SearchParams } from "../../../../../types";
import ResetFiltersButton from "@/components/ResetFiltersButton";

type MessageList = Messages & { Student: Student; Class: Class };

const renderRow = (item: MessageList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td className="hidden md:table-cell w-24">
      {new Date(item.date).toLocaleDateString("en-GB").replace(/\//g, "-")}
    </td>

    {(role === "teacher" || role === "admin") && (
      <>
        <td className="hidden md:table-cell capitalize w-32">{item.type.toLowerCase()}</td>
        <td>
          <div className="flex flex-col">
            {item.Student ? (
              <>
                <h3 className="font-semibold">{item.Student.name}</h3>
                <p className="text-xs">{item.studentId}</p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-500 italic">Class / School-wide</h3>
                <p className="text-xs text-gray-400">No specific student</p>
              </>
            )}
          </div>
        </td>
        <td className="hidden md:table-cell w-24">
          {item.Class?.name ?? <span className="text-gray-400 italic">All Classes</span>}
        </td>
      </>
    )}

    <td className="p-4 whitespace-pre-line px-0">{item.message}</td>

    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="messages" type="update" data={item} />
            <FormContainer table="messages" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  ...(role === "teacher" || role === "admin"
    ? [
      { header: "Type", accessor: "type", className: "hidden md:table-cell" },
      { header: "Student Name", accessor: "student", className: "hidden md:table-cell" },
      { header: "Class", accessor: "class", className: "hidden md:table-cell" },
    ]
    : []),
  { header: "Message", accessor: "message", className: "hidden md:table-cell" },
  ...((role === "admin" || role === "teacher" )? [{ header: "Actions", accessor: "action" }] : []),
];

const MessagesList = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  const { role, userId, classId: teacherClassId } = await fetchUserInfo();

  const columns = getColumns(role);

  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const sortKey = Array.isArray(params.sortKey) ? params.sortKey[0] : params.sortKey || "id";

  const searchValue = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;

  // Get user class(es)
  const userClassId = await getClassIdForRole(role, userId);

  // Base role filter
  const roleFilter: Prisma.MessagesWhereInput = {};
  if (role === "student") {
    roleFilter.OR = [
      { classId: { in: userClassId } },
      { studentId: userId },
      { classId: null, studentId: null },
    ];
  } else if (role === "teacher") {
    roleFilter.OR = teacherClassId
      ? [
        { classId: teacherClassId },
        { classId: null, studentId: null },
      ]
      : [{ classId: null, studentId: null }];
  }

  // Search filter
  let searchFilter: Prisma.MessagesWhereInput | undefined;
  if (searchValue) {
    searchFilter = {
      OR: [
        { message: { contains: searchValue, mode: "insensitive" } },
        { Student: { name: { contains: searchValue, mode: "insensitive" } } },
        { Student: { id: { contains: searchValue, mode: "insensitive" } } },
      ],
    };
  }

  // Combine filters safely
  const query: Prisma.MessagesWhereInput = searchFilter
    ? { AND: [roleFilter, searchFilter] }
    : roleFilter;



  const [data, count] = await prisma.$transaction([
    prisma.messages.findMany({
      orderBy: [{ [sortKey]: sortOrder }, { id: "desc" }],
      where: query,
      include: { Class: true, Student: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.messages.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Messages ({count})</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <ResetFiltersButton basePath="/list/messages" />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <SortButton sortKey="id" />
            {(role === "admin" || role === "teacher") && <FormContainer table="messages" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default MessagesList;
