import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Class, Exam, Prisma, Result, Student, Subject } from "@prisma/client";
import Image from "next/image";

type ResultWithDetails = Result & {
  student: Student & { class: Class };
  exam: Exam;
  subject: Subject;
};







const renderRow = (item: ResultWithDetails, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
    <td >{item.student.name + " " + item.student.surname}</td>
    <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td className="hidden md:table-cell">{item.student.class.name}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.exam.date)}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" || role === "teacher" && (
          <>
            <FormContainer table="result" type="update" data={item} />
            <FormContainer table="result" type="delete" id={item.id} />
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

  // Fetch user info and role
  const { userId, role } = await fetchUserInfo();

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
    // {
    //   header: "Type",
    //   accessor: "type",
    //   className: "hidden md:table-cell",
    // },
    ...(role === "admin" || role === "teacher"
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
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Initialize Prisma query object
  const query: Prisma.ResultWhereInput = {};

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { Exam: { title: { contains: value } } },
              { Student: { name: { contains: value } } },
            ];
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
      query.OR = [
        { Exam: { Class: { Teacher: { id: userId! } } } }, // Exams linked to the teacher’s class
      ];
      break;

    case "student":
      query.studentId = userId!;
      break;
  }


  // Fetch teachers and include related fields (subjects, classes)
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        Student: {
          select: { 
            name: true, 
            surname: true 
          },
        },
        Exam: {
          include: {
            Class: {
              select: {
                name: true,  // Fetching class name
                Teacher: {   // Fetching teacher details (supervisor of the class)
                  select: {
                    name: true,
                    surname: true,
                  },
                },
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
  

  const data = dataRes.map(item => {
    const assessment = item.Exam 

    if (!assessment) return null;

    const isExam = "startTime" in assessment;

    const data = dataRes.map(item => {
      const assessment = item.Exam;
    
      if (!assessment) return null;
    
      return {
        id: item.id,
        title: assessment.title,
        studentName: item.Student.name,
        studentSurname: item.Student.surname,
        teacherName: assessment.Class?.Teacher?.name || "N/A", // Teacher is in Class
        teacherSurname: assessment.Class?.Teacher?.surname || "N/A",
        score: item.score,
        className: assessment.Class?.name || "N/A",
        startTime: assessment.date, // Exams have 'date', no need for 'startTime' check
      };
    }).filter(Boolean); // Remove null values if any
    
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
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="result" type="create" />
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

export default ResultsList;
