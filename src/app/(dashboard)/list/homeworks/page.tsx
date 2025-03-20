import { startOfDay, endOfDay } from "date-fns";
import ClassFilterDropdown, { DateFilter } from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo, getClassIdForRole } from "@/lib/utils";
import { Class, Homework, Prisma } from "@prisma/client";
import Image from "next/image";
import SortButton from "@/components/SortButton";

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

const getColumns = (role: string | null) => [
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

const HomeworkListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const { page, gradeId, classId, date, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Fetch user info and role
  const { role, userId } = await fetchUserInfo();

  const columns = getColumns(role);  // Get dynamic columns

  // Get sorting order and column from URL
  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const sortKey = params.sortKey || "id"; // Default sorting column

  const selectedDate = new Date(date ?? new Date().toISOString().split("T")[0]);

  // Ensure selectedDate is UTC+5:30
  const selectedDateUTC = new Date(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate());

  // Create start and end timestamps
  const startDate = startOfDay(selectedDateUTC); // Ensures 00:00 UTC

  const endDate = endOfDay(selectedDateUTC); // Ensures 23:59:59 UTC

  // Apply to Prisma Query
  const query: Prisma.HomeworkWhereInput = {
    date: { gte: startDate, lt: endDate },
  };

  // Filter by classId (convert to integer)
  if (classId) {
    query.classId = Number(classId);
  }

  // Filter by gradeId (apply conditionally to Class relation)
  if (gradeId) {
    query.Class = { gradeId: Number(gradeId) };
  }

  
  // Fetch class ID based on role
  const userClassId = await getClassIdForRole(role, userId);
  
  
  // Apply class filter based on role
  if (userClassId) {
    query.classId = userClassId; // Apply student/teacher class filter
  } else if (classId) {
    query.classId = Number(classId); // Admin & teacher can filter by class
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

  // Fetch classes
  const classes = await prisma.class.findMany();

  const grades = await prisma.grade.findMany();

  //  * ROLE CONDITIONS
  
  // * Fetch teachers and include related fields (subjects, classes)
  const [data, count] = await prisma.$transaction([
    prisma.homework.findMany({
      orderBy: [
        { [sortKey]: sortOrder },  // Dynamic sorting (based on user selection)
        { id: "desc" },  // Default multi-column sorting        
      ],
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
        <div className="flex items-center gap-4">
          <DateFilter basePath="/list/homeworks" />
          {(role === "admin" || role === "teacher") && (
            <ClassFilterDropdown classes={classes} grades={grades} basePath="/list/homeworks" />
          )}
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <TableSearch />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>

              {/* Sort by Class ID */}
              <SortButton sortKey="id" />

              {(role === "admin" || role === "teacher") && (
                <FormContainer table="homeworks" type="create" />
              )}
            </div>
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
