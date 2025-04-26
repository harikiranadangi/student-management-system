import { Class, Messages, Prisma, Student } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo, getClassIdForRole } from "@/lib/utils";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { getUserIdentifiersForRole } from "@/lib/utils/getUserIdentifiersForRole";
import SortButton from "@/components/SortButton";



type MessageList = Messages & { Student: Student; Class: Class };

const renderRow = (item: MessageList, role: string | null) => (
  <tr
    key={item.id}
    className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight"
  >
    {/* Date */}
    <td className="hidden md:table-cell w-24">
    {new Date(item.date).toLocaleDateString("en-GB").replace(/\//g, '-')}
    </td>


    {/* Student Name (only for teacher/admin) */}
    {(role === "teacher" || role === "admin") && (
      <>
      <td className="hidden md:table-cell capitalize w-32">{item.type.toLowerCase()}</td>
        <td> <div className="flex flex-col">
          <h3 className="font-semibold">{item.Student.name}</h3>
          <p className="text-xs">{item.studentId}</p>
        </div>
        </td>
        {/* Type */}
        <td className="hidden md:table-cell w-24">{item.Class?.name}</td>
      </>
    )}

    {/* Message */}
    <td className="p-4 whitespace-pre-line px-0">{item.message}</td>



    {/* Actions */}
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="messages" type="update" data={item} />
            <FormContainer table="messages" type="delete" id={item.id} />
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
    header: "Type",
    accessor: "type",
    className: "hidden md:table-cell",
  },
  ...(role === "teacher" || role === "admin"
    ? [
      {
        header: "Student Name",
        accessor: "student",
        className: "hidden md:table-cell",
      },
      {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
      },
    ]
    : []),
  {
    header: "Message",
    accessor: "message",
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

const MessagesList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  // Await the searchParams first
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;
  // Fetch user info and role
  const { userId, role } = await fetchUserInfo();
  const { classId, studentId } = await getUserIdentifiersForRole(role, userId);

  console.log("Student Id:", studentId)

  const columns = getColumns(role);  // Get dynamic columns

  // Get sorting order and column from URL
  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const sortKey = params.sortKey || "id"; // Default sorting column


  // Initialize Prisma query object
  const query: Prisma.MessagesWhereInput = {};

  if (studentId) {
    query.studentId = studentId
  }

  // Filter by gradeId (apply conditionally to Class relation)
  const userClassId = await getClassIdForRole(role, userId);


  if (userClassId || classId) {
    query.classId = userClassId ?? Number(classId);
  }

  
  // Dynamically add filters based on query parameters
if (queryParams) {
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.OR = [
            { message: { contains: value, mode: "insensitive" } },
            { Student: { name: { contains: value, mode: "insensitive" } } },
            { Student: { id: { contains: value, mode: "insensitive" } } },
          ];
          break;
        default:
          break;
      }
    }
  }
}


  // Fetch messages and count
  const [data, count] = await prisma.$transaction([
    prisma.messages.findMany({
      orderBy: [
        { [sortKey]: sortOrder },  // Dynamic sorting (based on user selection)
        { id: "desc" },  // Default multi-column sorting        
      ],
      where: query,
      include: {
        Class: true,
        Student: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.messages.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Messages</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            {/* Sort by Class ID */}
            <SortButton sortKey="id" />
            {role === "admin" && <FormContainer table="messages" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST: Messages */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default MessagesList;
