import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils/server-utils";
import { FeeStructure, Grade } from "@prisma/client";
import Image from "next/image";
import { SearchParams } from "../../../../../../types";

// Types
type FeesList = Grade & {
  feestructure: FeeStructure[];
};

// Helpers
const getPageNumber = (params: SearchParams) => {
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  return parseInt(page || "1", 10);
};

const getSortedParams = (params: SearchParams) => {
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = Array.isArray(params.sortKey) ? params.sortKey[0] : params.sortKey || "id";
  return { sortKey, sortOrder };
};

const renderRow = (grade: FeesList, role: string | null) => {
  if (!grade.feestructure?.length) return null;

  return grade.feestructure.map((fee) => {
    const total = (fee.termFees ?? 0) + (fee.abacusFees ?? 0);

    return (
      <tr key={fee.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
        <td className="flex items-center gap-2 p-2">{grade.level}</td>
        <td>{fee.term}</td>
        <td>{total}</td>
        <td>{fee.startDate ? new Intl.DateTimeFormat("en-GB").format(new Date(fee.startDate)) : "-"}</td>
        <td>{fee.dueDate ? new Intl.DateTimeFormat("en-GB").format(new Date(fee.dueDate)) : "-"}</td>
        <td>{fee.academicYear == "Y2024_2025" ? "2024-25" : "2025-26"}</td>
        <td>
          {role === "admin" && (
            <div className="flex items-center gap-2">
              <FormContainer table="fees" type="update" data={fee} />
              <FormContainer table="fees" type="delete" id={fee.id} />
            </div>
          )}
        </td>
      </tr>
    );
  });
};

const getColumns = (role: string | null) => [
  { header: "Grade", accessor: "level" },
  { header: "Term", accessor: "feestructure.term" },
  { header: "Term Fees", accessor: "feestructure.termFees" },
  { header: "Start Date", accessor: "feestructure.startDate" },
  { header: "Due Date", accessor: "feestructure.dueDate" },
  { header: "Academic Year", accessor: "feestructure.academicyear" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

// Main Page
const FeesListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const page = getPageNumber(params);
  const { sortKey, sortOrder } = getSortedParams(params);
  const { role } = await fetchUserInfo();
  const columns = getColumns(role);

  const [grades, totalCount] = await prisma.$transaction([
    prisma.grade.findMany({
      include: { feestructure: true },
      orderBy: { [sortKey]: sortOrder },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.grade.count(),
  ]);

  return (
    <div className="flex-1 m-4 mt-0 bg-white rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">Fees Management</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <SortButton sortKey="level" />
            {role === "admin" && <FormContainer table="fees" type="create" />}
          </div>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={grades} />

      {/* Pagination */}
      <Pagination page={page} count={totalCount} />
    </div>
  );
};

export default FeesListPage;
