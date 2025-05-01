

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Class, Exam, Prisma, Result, Student, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { SearchParams } from "../../../../../types";

type ResultList = Result & {
  student: Student;
  exam: Exam & {
    class: Class & {
      teacher: Teacher;
    };
  };
  subject: Subject;
};

const renderRow = (item: ResultList, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
    <td>{item.student.name}</td>
    <td className="hidden md:table-cell">{item.exam.class.name}</td>
    <td className="p-4">{item.subject.name}</td>
    <td className="hidden md:table-cell">{item.marks}</td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(new Date(item.exam.date))}</td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="result" type="update" data={item} />
            <FormContainer table="result" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const getColumns = (role: string | null) => [
  { header: "Student", accessor: "student" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Subject", accessor: "subject" },
  { header: "Score", accessor: "score", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
];

const ResultsList = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { role } = await fetchUserInfo();
  const columns = getColumns(role);

  const { page, ...queryParams } = await searchParams;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  const query: Prisma.ResultWhereInput = {};

  if (queryParams.search) {
    const searchValue = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;
    query.OR = [
              { Exam: { title: { contains: searchValue, mode: "insensitive" } } },
              { Student: { name: { contains: searchValue, mode: "insensitive" } } },
            ];
        }

  // Fetching Data
  const [data, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        Student: true,
        Subject: true,
        Exam: {
          include: {
            examGradeSubjects: {
              include: {
                },
            } // To get class.name
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.result.count({ where: query }),
  ]);



  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Results</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
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

      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default ResultsList;
