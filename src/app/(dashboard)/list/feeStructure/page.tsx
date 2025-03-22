import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Class, FeesStructure, Prisma } from "@prisma/client";
import Image from "next/image";

type FeesList = Class & {
  fees: FeesStructure;
};


const renderRow = (item: FeesList, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
    <td>{item.name}</td>
    <td>{item.fees?.termFees}</td>
    <td>{item.fees?.abacusFees}</td>
    <td>{item.fees?.totalFees ?? "N/A"}</td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin") && (
          <>
            <FormContainer table="fees_structure" type="update" data={item.fees} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Class", accessor: "name" },
  { header: "Term Fees", accessor: "fees.termFees" },
  { header: "Abacus Fees", accessor: "fees.abacusFees" },
  { header: "Total Fees", accessor: "fees.totalFees" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const FeesListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const { page } = params;
  const p = page ? parseInt(page) : 1;
  
  // Fetch user info and role
  const { role } = await fetchUserInfo();

  const columns = getColumns(role);  // Get dynamic columns

  // Get sorting order and column from URL
  const sortOrder = searchParams.sort === "desc" ? "desc" : "asc";
  const sortKey = searchParams.sortKey || "id"; // Default sorting column


  // Initialize Prisma query object
  const query: Prisma.FeesStructureWhereInput = {};

  // Fetch fees with related student, class, and fees structure details
  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      orderBy: { [sortKey]: sortOrder },
      include: {
        fees: true, // Include FeesStructure for each class
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count(),
  ]);

  // Rendering 
  return (
    <div className="flex-1 m-4 mt-0 bg-white rounded-md">
      
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">Fees Structure ({count} Classes)</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">

          <TableSearch />
          <div className="flex items-center self-end gap-4">

            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>

            {/* Sort by Class ID */}
            <SortButton sortKey="id" />

            {(role === "admin") && (
              <FormContainer table="fees" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST: Fees Table */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />
        
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default FeesListPage;