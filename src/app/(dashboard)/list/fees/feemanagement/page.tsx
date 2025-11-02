import ClassFilterDropdown from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils/server-utils";
import Image from "next/image";
import { FeesList, SearchParams } from "../../../../../../types";
import ResetFiltersButton from "@/components/ResetFiltersButton";
import AcademicYearDropdown from "@/components/dropdowns/AcademicYearDropdown";

// Row Renderer
const renderRow = (grade: FeesList, role: string | null) => {
  if (!grade.feestructure?.length) return null;

  return grade.feestructure.map((fee) => {
    const total = (fee.termFees ?? 0) + (fee.abacusFees ?? 0);

    return (
      <tr
        key={fee.id}
        className="text-sm border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100 
                   dark:border-gray-700 dark:even:bg-gray-800 dark:hover:bg-gray-700"
      >
        <td className="p-2">{grade.level}</td>
        <td>{fee.term}</td>
        <td>{total}</td>
        <td>
          {fee.startDate
            ? new Intl.DateTimeFormat("en-GB").format(new Date(fee.startDate))
            : "-"}
        </td>
        <td>
          {fee.dueDate
            ? new Intl.DateTimeFormat("en-GB").format(new Date(fee.dueDate))
            : "-"}
        </td>
        <td>{fee.academicYear === "Y2024_2025" ? "2024-25" : "2025-26"}</td>
        {role === "admin" && (
          <td className="p-2">
            <div className="flex items-center gap-2">
              <FormContainer table="fees" type="update" data={fee} />
              <FormContainer table="fees" type="delete" id={fee.id} />
            </div>
          </td>
        )}
      </tr>
    );
  });
};

// Columns
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
const FeesListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const page = Number(
    Array.isArray(params.page) ? params.page[0] : params.page || "1"
  );
  const academicYear = params.academicYear || undefined;
  const gradeId = Array.isArray(params.gradeId)
    ? params.gradeId[0]
    : params.gradeId;
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = Array.isArray(params.sortKey)
    ? params.sortKey[0]
    : params.sortKey || "id";

  const { role } = await fetchUserInfo();
  const columns = getColumns(role);

  const whereClause: any = {};

  if (gradeId) whereClause.id = Number(gradeId);
  if (academicYear) {
    whereClause.feestructure = {
      some: {
        ...(academicYear ? { academicYear } : {}),
      },
    };
  }

  const [grades, totalCount] = await Promise.all([
    prisma.grade.findMany({
      where: whereClause,
      select: {
        id: true,
        level: true,
        feestructure: {
          select: {
            id: true,
            term: true,
            termFees: true,
            abacusFees: true,
            startDate: true,
            dueDate: true,
            academicYear: true,
          },
        },
      },
      orderBy: { [sortKey]: sortOrder },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.grade.count({ where: whereClause }),
  ]);

  const allGrades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const Path = `/list/fees/feemanagement`;

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white dark:bg-gray-900 rounded-md text-black dark:text-white">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="hidden text-lg font-semibold md:block">
          Fees Management ({totalCount})
        </h1>

        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          {/* Academic Year Dropdown */}
          <AcademicYearDropdown basePath={Path} />
          <ClassFilterDropdown
            classes={[]}
            grades={allGrades}
            basePath={Path}
            showClassFilter={false}
          />
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <ResetFiltersButton basePath={Path} />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="Filter" width={14} height={14} />
              </button>
              <SortButton sortKey="level" />
              {role === "admin" && <FormContainer table="fees" type="create" />}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        renderRow={(item) => renderRow(item, role)}
        data={grades}
      />

      {/* Pagination */}
      <Pagination page={page} count={totalCount} />
    </div>
  );
};

export default FeesListPage;
