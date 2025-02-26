import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Class, Fee, Prisma, Student } from "@prisma/client";
import Image from "next/image";

type FeesList = Fee & { Student: Student } & { class: Class };

const renderRow = (item: FeesList, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
    <td className="p-4">{item.studentId}</td>
    <td>{item.Student?.name || "-"}</td>
    <td>{item.class?.name || "-"}</td>
    <td>{item.amount}</td>
    <td>{item.feesbook}</td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="fees" type="update" data={item} />
            <FormContainer table="fees" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const FeesListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Fetch user info and role
  const { userId, role } = await fetchUserInfo();

  const columns = [
    { header: "ID", accessor: "studentId" },
    { header: "Name", accessor: "Student.name" },
    { header: "Class", accessor: "Student.Class.name" },
    { header: "Amount", accessor: "amount" },
    { header: "Feebook", accessor: "feesbook" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const params = await searchParams;
  const { page } = params;
  const p = page ? parseInt(page) : 1;

  // Initialize Prisma query object
  const query: Prisma.FeeWhereInput = {};

  // Fetch fees with related student and class details
  const [data, count] = await prisma.$transaction([
    prisma.fee.findMany({
      where: query,
      include: {
        Student: {
          include: {
            Class: true,  // Ensure only one class is included
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.fee.count({ where: query }),
  ]);



  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">Fees Payments</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
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