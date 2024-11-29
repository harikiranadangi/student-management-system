import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type Exams = Exam & {lesson: {
  subject: Subject,
  class: Class,
  teacher: Teacher 
}}


  

  const renderRow = (item: Exams, role: string | null) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname }</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime) }</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
              <>
              <FormModal table="exam" type="update" data={item}/> 
              <FormModal table="exam" type="delete"  id={item.id} /> 
             </>
          )}
        </div>
      </td>
    </tr>
  );
const ExamsList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  const role = await getRole();

  const { userId } = await auth()

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
      header: "Date",
      accessor: "date",
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
  const query: Prisma.ExamWhereInput = {};

  query.lesson = {};

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson = {classId: parseInt(value)};
            break;
          case "teacherId":
            query.lesson = {teacherId: value};
            break;
          case "search":
            query.lesson = {
              subject :{
                name: {contains:value}
              }
            }
            break;
            default:
              break;
        }
      }
    }
  }

  //  * ROLE CONDITIONS
  
  switch (role) {
    case "admin":
      break;
    
    case "teacher":
      query.lesson.teacherId = userId!
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: userId!
          },
        },
      };
      break;
  }

  // Fetch teachers and include related fields (subjects, classes)
  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
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
    prisma.exam.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Exams</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher" ) && (
                <FormModal table="exam" type="create"/> 
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

export default ExamsList;
