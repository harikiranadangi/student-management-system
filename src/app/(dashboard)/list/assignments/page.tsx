import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type Assignments = Assignment & {lesson: {
  subject: Subject,
  class: Class,
  teacher: Teacher 
}}


  const renderRow = (item: Assignments, role: string | null) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
      <td className="hidden md:table-cell">
        {}
        {new Intl.DateTimeFormat("en-US").format(item.endDate) }
        </td>
      <td>
        <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="assignment" type="update" data={item}  /> 
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

const AssignmentsList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Fetch user role
  const role = await getRole();
  
  // Fetch userId
  const userId = await auth();

  // Define columns dynamically based on role
  const columns = [
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Due date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
      },
      ...(role === "admin" || role === "teacher"
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
  const query: Prisma.AssignmentWhereInput = {};

  query.lesson = {};



  // Dynamically add filters based on query parameters
    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          switch (key) {
            case "classId":
              query.lesson.classId = parseInt(value);
              break;
            case "teacherId":
              query.lesson.teacherId = parseInt(value);
              break;
            case "search":
              query.lesson.subject= {
                  name: {contains:value},
              };
              break;
              default:
              break;
          }
        }
      }
    }

    // switch (role) {
    //   case "admin":
    //     break;
    //   case "teacherId":
    //     query.lesson.teacherId = parseInt(userId, 10)
    //     break;
    // }
     
    // Fetch teachers and include related fields (subjects, classes)
    const [data, count] = await prisma.$transaction([
      prisma.assignment.findMany({
        where: query,
        include: {
          lesson: {
            select: {
              subject: { select: { name: true } },
              teacher: { select: { name: true, surname:true } },
              class: { select: { name: true } },
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.assignment.count({ where: query }),
    ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Assignments</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role === "teacher" && (
                <FormModal table="assignment" type="create" /> 
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

export default AssignmentsList;
