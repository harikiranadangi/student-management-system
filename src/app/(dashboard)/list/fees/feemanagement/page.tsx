import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { FeesStructure, Grade } from "@prisma/client";
import Image from "next/image";

type FeesList = Grade & {
  feestructure: FeesStructure | null; // Since 1 Grade has 1 Fee Structure
};

const renderRow = (item: FeesList, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
    <td>{item.level}</td>
    <td>{item.feestructure ? item.feestructure.termFees : "-"}</td>
    <td>{item.feestructure ? item.feestructure.abacusFees : "-"}</td>
    <td>
      {item.feestructure?.startDate
        ? new Intl.DateTimeFormat("en-GB").format(new Date(item.feestructure.startDate))
        : "-"}
    </td>
    <td>
      {item.feestructure?.dueDate
        ? new Intl.DateTimeFormat("en-GB").format(new Date(item.feestructure.dueDate))
        : "-"}
    </td>
    <td>{item.feestructure ? item.feestructure.totalFees : "-"}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="fees" type="update" data={item.feestructure} />
          </>
        )}
      </div>
    </td>
  </tr>
);


const getColumns = (role: string | null) => [
  { header: "Grade", accessor: "level" },
  { header: "Term Fees", accessor: "fees.termFees" },
  { header: "Abacus Fees", accessor: "fees.abacusFees" },
  { header: "Start Date", accessor: "fees.startDate" },
  { header: "Due Date", accessor: "fees.dueDate" },
  { header: "Total Fees", accessor: "fees.totalFees" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const FeesListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  // Fetch user info and role
  const { role } = await fetchUserInfo();

  const columns = getColumns(role); // Get dynamic columns

  // Get sorting order and column from URL
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = params.sortKey || "id"; // Default sorting by grade level

  // Fetch grades with their respective fee structure
  const [data, count] = await prisma.$transaction([
    prisma.grade.findMany({
      include: {
        feestructure: true, // ✅ 1-to-1 relationship now
      },
      orderBy: { [sortKey]: sortOrder },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.grade.count(),
  ]);

  // Rendering
  return (
    <div className="flex-1 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
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
      {/* LIST: Fees Table */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  );
};

export default FeesListPage;
