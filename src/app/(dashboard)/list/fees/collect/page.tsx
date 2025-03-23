import ClassFilterDropdown from "@/components/FilterDropdown";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// Define types
type StudentList = Student & { Class?: { name: string } };

// Function to render a table row
const renderRow = (item: StudentList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-100 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    <td className="flex items-center gap-2 p-2">
      <Image
        src={item.img || "/profile.png"}
        alt={item.name}
        width={40}
        height={40}
        className="object-cover w-10 h-10 rounded-full md:hidden xl:block"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs">{item.id}</p>
      </div>
    </td>

    <td>{item.Class?.name ?? "N/A"}</td>
    <td className="hidden md:table-cell">{item.gender}</td>
    <td className="hidden md:table-cell">{item.parentName || 'N/A'}</td>
    <td className="hidden md:table-cell">{new Date(item.dob).toLocaleDateString()}</td>
    <td className="hidden md:table-cell">{item.phone}</td>

    <td className="p-2">
      <div className="flex items-center gap-2">
      <Link href={`collect/${item.id}`}>
        <button className="px-3 py-1 text-gray-500 rounded bg-LamaPurple hover:bg-LamaSky">
          Collect Fees
        </button>
      </Link>
      </div>
    </td>
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Student Name", accessor: "name" },
  { header: "Class", accessor: "class" },
  { header: "Gender", accessor: "gender" },
  { header: "Parent Name", accessor: "parentName" },
  { header: "DOB", accessor: "dob" },
  { header: "Mobile", accessor: "phone" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const { page, gradeId, classId, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  
  // Fetch user info and role
  const { role } = await fetchUserInfo();
  
  const columns = getColumns(role);

  // Get sorting order and column from URL
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = params.sortKey || "classId"; // Default sorting column


  // Build the Prisma query based on filters
  const query: Prisma.StudentWhereInput = {};

  // Filter by classId (convert to integer)
  if (classId) {
    query.classId = Number(classId);
  }

  // Filter by gradeId (apply conditionally to Class relation)
  if (gradeId) {
    query.Class = { gradeId: Number(gradeId) };
  }

  // Search logic
  if (queryParams.search) {
    query.OR = [
      { name: { contains: queryParams.search, mode: "insensitive" } },
      { id: { contains: queryParams.search } },
      { Class: { name: { contains: queryParams.search, mode: "insensitive" } } },
    ];
  }

  // Fetch only classes that belong to the selected grade (if any)
  const classes = await prisma.class.findMany({
    where: gradeId ? { gradeId: Number(gradeId) } : {},
  });

  // Fetch all grades
  const grades = await prisma.grade.findMany();
  

  // Fetch students and count
  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      orderBy: [
        { [sortKey]: sortOrder },  // Dynamic sorting (based on user selection)
        { classId: "asc" },  // Default multi-column sorting
        { gender: "desc" },
        { name: "asc" },
      ],
      where: query,
      include: { Class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  console.log(JSON.stringify(query, null, 2)); // Debugging output

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Students ({count})</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <ClassFilterDropdown
            classes={classes}  // ✅ Filtered dynamically based on selected grade
            grades={grades}
            basePath="/list/students"
          />
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <TableSearch />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <SortButton sortKey="id" />
              {role === "admin" && (
                <FormContainer table="student" type="create" />
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

export default StudentListPage;
