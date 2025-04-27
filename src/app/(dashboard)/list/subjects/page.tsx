import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { Grade, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type SubjectListType = Subject & {
  grades: Grade[];
  teachers: { teacher: Teacher }[]; // Assuming SubjectTeacher relation here
};

const renderRow = (item: SubjectListType, role: string | null) => {
  const gradeLevels = item.grades.map(gradeSubject => gradeSubject.level || "Unknown").join(", ");
  const teacherNames = item.teachers.map(({ teacher }) => teacher.name).join(", ");
  
  return (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        {item.name}
      </td>
      <td className="hidden md:table-cell">
        {gradeLevels}
      </td>
      <td className="hidden md:table-cell">
        {teacherNames || "No Teachers"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const SubjectList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { userId, role } = await fetchUserInfo();

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Grade",
      accessor: "level",
      className: "hidden md:table-cell",
    },
    {
      header: "Teachers",
      accessor: "teachers",
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

  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = { contains: value };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        grades: true, // Include related grades for the subject
        teachers: {
          include: {
            teacher: {
              select: {
                name: true, // Access teacher's name
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Subjects ({count})</h1>
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
              <FormContainer table="subject" type="create" />
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

export default SubjectList;
