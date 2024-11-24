import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resultsData,  role, studentsData} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type Results = {
  id: number;
  subject: string;
  class: number;
  student: string
  teacher : string;
  date: string;
  type: "exam" | "assignment";
  score: number;
};

const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Student",
      accessor: "student",
      className: "hidden md:table-cell",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
    },
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
    
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  

  const renderRow = (item: Results) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td >{item.student }</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.teacher }</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td className="hidden md:table-cell">{item.type}</td>
      <td>
        <div className="flex items-center gap-2">
        {role === "admin" && (
            <>
              <FormModal table="result" type="update" data={item} /> 
              <FormModal table="result" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );

const ResultsList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Initialize Prisma query object
  const query: Prisma.ResultScalarWhereInput = {};

  // Dynamically add filters based on query parameters
    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          switch (key) {
            case "classId":
              query.lesson = {classId: parseInt(value)};
              break;
            case "teacherId":
              query.lesson = {teacherId: parseInt(value)};
              break;
            case "search":
              query.lesson = {
                subject :{
                  name: {contains:value}
                }
              }
              break;
          }
        }
      }
    }
  
    // Fetch teachers and include related fields (subjects, classes)
    const [dataRes, count] = await prisma.$transaction([
      prisma.result.findMany({
        where: query,
        include: {
          student: {select: {name: true, surname:true}},
          exam: {
            include: {
              lesson: {
                select: {
                  class: {select: { name: true} },
                  teacher: {select: { name: true, surname: true} },
                },
              },
            },
          },
          assignment: {
            include: {
              lesson: {
                select: {
                  class: {select: { name: true} },
                  teacher: {select: { name: true, surname: true} },
                },
              },
            },
          },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.result.count({ where: query }),
    ]);

    const data = dataRes.map(item=>{
      const assessment = item.exam || item.assignment

      if(!assessment) return null;

      const isExam = "startTime" in assessment;

      return{
        id:item.id,
        title: assessment.title,
        studentName: item.student.name,
        studentSurname: item.student.surname,
        teacherName: assessment.lesson.teacher.name,
        teacherSurname: assessment.lesson.teacher.surname,
        score: item.score,
        className: assessment.lesson.class.name,
        startTime: isExam ? assessment.startTime : assessment.s,
      }
    })

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Results</h1>
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
                <FormModal table="result" type="create"/> 
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION: Description */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultsList;
