import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Class, Homework, Prisma } from "@prisma/client";
import Image from "next/image";

type Homeworks = Homework & { Class: Class };

const renderRow = (item: Homeworks, role: string | null) => (

  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    {/* <td className="flex items-center gap-4 p-4">{item.title}</td> */}
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-GB").format(new Date(item.date)).replace(/\//g, "-")}</td>


    <td className="hidden md:table-cell">{item.Class?.name ?? "N/A"}</td>
    <td className="flex items-center gap-4 p-4 whitespace-pre-line">{item.description}</td>


    <td><div className="flex items-center gap-2">
      {(role === "admin" || role === "teacher") && (
        <>
          <FormContainer table="homeworks" type="update" data={item} />
          <FormContainer table="homeworks" type="delete" id={item.id} />
        </>
      )}
    </div>
    </td>
  </tr>
);

const HomeworkListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  // Fetch user info and role
  const { role } = await fetchUserInfo();

  const columns = [
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
    },
    // {
    //   header: "Title",
    //   accessor: "title",
    //   className: "hidden md:table-cell",
    // },
    {
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === 'teacher'
      ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
      : []),
  ];

  // Await the searchParams first
  const params = await searchParams;
  const { page, classId, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Initialize Prisma query object
  const query: Prisma.HomeworkWhereInput = {};

  // Apply classId filter if present in URL
  if (classId) {
    query.classId = parseInt(classId);
  }

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            // query.Class?.name = { contains: value }
            break;
          default:
            break;
        }
      }
    }
  }

  //  * ROLE CONDITIONS
  // * Fetch teachers and include related fields (subjects, classes)
  const [data, count] = await prisma.$transaction([
    prisma.homework.findMany({
      where: query,
      include: {
        Class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.homework.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">Homeworks</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="homeworks" type="create" />
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

export default HomeworkListPage;
