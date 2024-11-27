import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { Class, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";

type ClassList = Class & { supervisor: Teacher };

const renderRow = (item: ClassList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="hidden md:table-cell">
      {item.supervisor.name + " " + item.supervisor.surname}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="class" type="update" data={item} />
            <FormModal table="class" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const ClassesList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Fetch user role
  const role = await getRole();

  // Define columns dynamically based on role
  const columns = [
    {
      header: "Class Name",
      accessor: "name",
    },
    {
      header: "Supervisor",
      accessor: "supervisor",
      className: "hidden md:table-cell",
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

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Initialize Prisma query object
  const query: Prisma.ClassWhereInput = {};

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = parseInt(value);
            break;
          case "search":
            query.name = { contains: value };
            break;
          default:
            break;
        }
      }
    }
  }

  // Fetch classes and include related fields (supervisor)
  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Classes</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />
      {/* PAGINATION: Description */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassesList;
