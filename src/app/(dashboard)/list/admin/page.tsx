import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Admin, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type AdminList = Admin

const renderRow = (item: AdminList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-100 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td className="flex items-center gap-2 p-2">
      <Image
        src={item.img || "/profile.png"}
        alt={item.full_name}
        width={40}
        height={40}
        className="object-cover w-10 h-10 rounded-full md:hidden xl:block"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.full_name}</h3>
        <p className="text-xs text-gray-500">{item.username}</p>
      </div>
    </td> 

    <td className="hidden md:table-cell">{item.gender}</td>
    <td className="hidden md:table-cell">{item.parentName || 'N/A'}</td>
    <td>{item.dob ? new Date(item.dob).toLocaleDateString() : 'Not Available'}</td>
    <td className="hidden md:table-cell">{item.phone}</td>

    <td className="p-2">
      <div className="flex items-center gap-2">
        <Link href={`/list/students/${item.id}`}>
          <button className="flex items-center justify-center rounded-full w-7 h-7 bg-LamaSky">
            <Image src="/view.png" alt="View" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <FormContainer table="student" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const AdminListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Fetch user info and role
  const { role } = await fetchUserInfo();

  const columns = [
    { header: "Student Name", accessor: "full_name" },
    { header: "Gender", accessor: "gender" },
    { header: "Parent Name", accessor: "parentName" },
    { header: "DOB", accessor: "dob" },
    { header: "Mobile", accessor: "phone" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  // Initialize Prisma query object
  const query: Prisma.AdminWhereInput = {};

  // Dynamically add filters based on query parameters
  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            // Search by name or id
            query.OR = [
              { full_name: { contains: value, mode: "insensitive" } },
              { username: { contains: (value) } },
            ];
            break;
        }
      }
    }
  }

  // Fetch students and include related fields (classes, etc.)
  const [data, count] = await prisma.$transaction([
    prisma.admin.findMany({
      where: query,
      
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.admin.count({ where: query }),
  ]);

  // Debugging: Log the fetched data
  console.log("Admin Data:", JSON.stringify(data, null, 2));

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Students</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="admin" type="create" />
            )}
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

export default AdminListPage;
