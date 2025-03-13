import React from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student, Subject, Teacher } from "@prisma/client";
import Link from "next/link";
import FormContainer from "@/components/FormContainer";
import { fetchUserInfo } from "@/lib/utils";

// Define types
type TeachersList = Teacher & {
  subjects: { Subject: Subject }[]; // ✅ Fetches Subject details
  class?: Class & { students: Student[] }| null; // ✅ Fetch multiple classes with students
};


// *If you want to show the students in the class, use this line instead of the one above
// * type TeachersList = Teacher & {
// *  subjects: { Subject: Subject }[];
// * <td className="hidden w-32 md:table-cell">{item.classes?.map(classItem => classItem.name)}</td>

// Function to render a table row
const renderRow = (item: TeachersList, role: string | null) => (
  console.log("Subjects Data:", item.subjects),
  console.log("Class Data:", item.class),
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">

    {/* Info Column */}
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || "/teacher.png"}
        alt={``}
        width={40}
        height={40}
        className="object-cover w-10 h-10 rounded-full md:hidden xl:block"
      />
      <div className="flex flex-col ">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs">{item?.username ?? 'No email available'}</p>
      </div>
    </td>

    <td className="px-2 w-36 md:table-cell">
      {item.phone}
    </td>

    {/* Directly use the strings from subjects and classes */}
    <td className="hidden w-32 md:table-cell">
      {item.class ? item.class.name : "No Class Assigned"}
    </td>

    <td className="hidden w-32 truncate md:table-cell">
      {item.subjects?.map((ts) => ts.Subject?.name).join(", ") || "No subjects"}
    </td>

    {/* Actions Column */}
    <td className="p-2">
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="flex items-center justify-center rounded-full w-7 h-7 bg-LamaSky">
            <Image src="/view.png" alt="View" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <>
            <FormContainer table="teacher" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);


const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  // Fetch user info and role
  const { role } = await fetchUserInfo();

  // Define table columns
  const columns = [
    {
      header: "Name",
      accessor: "info",
    },

    {
      header: "Phone",
      accessor: "phone",
      className: "lg:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    // {
    //   header: "Address",
    //   accessor: "address",
    //   className: "hidden lg:table-cell",
    // },
    ...(role === "admin"
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
  const query: Prisma.TeacherWhereInput = {};

  // Dynamically add filters based on query parameters
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
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: {
          include: {
            Subject: true, // ✅ Fetch Subject details
          },
        },
        class: {  // ✅ Fetch multiple classes (Fix this!)
          include: {
            students: true, // ✅ Fetch students in the class
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Teachers</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            <FormContainer table="teacher" type="create" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      {/* Pagination Section */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
