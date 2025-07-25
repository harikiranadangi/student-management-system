import { startOfDay, endOfDay } from "date-fns";
import ClassFilterDropdown, { DateFilter } from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo, getClassIdForRole } from "@/lib/utils";
import { Class, Grade, PermissionSlip, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import SortButton from "@/components/SortButton";
import ResetFiltersButton from "@/components/ResetFiltersButton";
import { SearchParams } from "../../../../../types";
import ExportButton from "@/components/ExportButton";

type PermissionWithRelations = PermissionSlip & {
  student: Student & {
    Class: Class & { Grade: Grade };
  };
};

const renderRow = (item: PermissionWithRelations, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td>
      {new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(item.timeIssued))}
    </td>
    <td>{item.student.name}</td>
    <td>{item.student.Class?.name ?? "N/A"}</td>
    <td>{item.leaveType}</td>
    <td>{item.description || "-"}</td>
    <td>{item.withWhom}</td>
    <td>{item.relation}</td>
    {(role === "admin" || role === "teacher") && (
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="permissions" type="update" data={item} />
          <FormContainer table="permissions" type="delete" id={item.id} />
        </div>
      </td>
    )}
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Issued Time", accessor: "timeIssued" },
  { header: "Student", accessor: "student" },
  { header: "Class", accessor: "class" },
  { header: "Leave Type", accessor: "leaveType" },
  { header: "Description", accessor: "description" },
  { header: "Person Name", accessor: "withWhom" },
  { header: "Relation", accessor: "relation" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const PermissionSlipListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const { page, gradeId, classId, date, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  const { role, userId } = await fetchUserInfo();
  const columns = getColumns(role);

  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const sortKey = Array.isArray(params.sortKey) ? params.sortKey[0] : params.sortKey || "id";

  const rawDate = Array.isArray(date) ? date[0] : date;
  const selectedDate = new Date(rawDate ?? new Date().toISOString().split("T")[0]);
  const selectedDateUTC = new Date(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate());
  const startDate = startOfDay(selectedDateUTC);
  const endDate = endOfDay(selectedDateUTC);

  const query: Prisma.PermissionSlipWhereInput = {
    date: { gte: startDate, lt: endDate },
  };

  query.student = {
    AND: [
      ...(classId ? [{ classId: Number(classId) }] : []),
      ...(gradeId
        ? [
          {
            Class: {
              gradeId: Number(gradeId),
            },
          },
        ]
        : []),
    ],
  };

  const userClassId = await getClassIdForRole(role, userId);
  if (userClassId) query.student = { classId: userClassId };

  const [data, count] = await prisma.$transaction([
    prisma.permissionSlip.findMany({
      where: query,
      orderBy: [{ [sortKey]: sortOrder }, { id: "desc" }],
      include: {
        student: {
          include: {
            Class: { include: { Grade: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.permissionSlip.count({ where: query }),
  ]);

  const grades = await prisma.grade.findMany();
  const classes = await prisma.class.findMany();

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">Permission Slips</h1>
        <div className="flex items-center gap-4">
          <DateFilter basePath="/list/permissions" />
          {(role === "admin" || role === "teacher") && (
            <ClassFilterDropdown classes={classes} grades={grades} basePath="/list/permissions" />
          )}
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <TableSearch />
            <ResetFiltersButton basePath="/list/permissions" />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <SortButton sortKey="id" />
              {(role === "admin") && (
                <FormContainer table="permissions" type="create" />
              )}
              <ExportButton data={data} fileName="Permission_Slips" />
            </div>
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />
      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default PermissionSlipListPage;
