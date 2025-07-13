import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Class, Grade, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import { SearchParams } from "../../../../../types";

type ClassList = Class & {
  Teacher: Teacher | null;
  Grade: Grade;
};


const renderRow = (item: ClassList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.Grade.level} - {item.section}</td>
    <td className="hidden md:table-cell">
      {item.Teacher ? `${item.Teacher.name}` : "No Class Teacher"}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="class" type="update" data={item} />
            <FormContainer table="class" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Class Name", accessor: "name" },
  { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const ClassesList = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const { role } = await fetchUserInfo();

  const pageParam = params.page;
  const currentPage = Array.isArray(pageParam) ? parseInt(pageParam[0]) : parseInt(pageParam || "1");

  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKeyRaw = params.sortKey;
  const sortKey = Array.isArray(sortKeyRaw) ? sortKeyRaw[0] : sortKeyRaw || "id";

  const query: Prisma.ClassWhereInput = {};

  for (const [key, value] of Object.entries(params)) {
    const val = Array.isArray(value) ? value[0] : value;
    if (!val) continue;

    switch (key) {
      case "supervisorId":
        query.supervisorId = val;
        break;
      case "search":
        query.name = { contains: val };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      orderBy: { [sortKey]: sortOrder },
      where: query,
      include: {
        Teacher: { select: { name: true } },
        Grade: { select: { level: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Classes</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <SortButton sortKey="id" />
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={getColumns(role)} renderRow={(item) => renderRow(item, role)} data={data} />
      <Pagination page={currentPage} count={count} />
    </div>
  );
};

export default ClassesList;
