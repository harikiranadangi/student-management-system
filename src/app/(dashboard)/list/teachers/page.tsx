import React from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Link from "next/link";
import { getRole } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";

// Define types
type TeachersList = Teacher & { subjects: Subject[] } & { classes: Class[] };

// Function to render a table row
const renderRow = (item: TeachersList, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
    {/* Info Column */}

    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || "/profile.png"}
        alt={``}
        width={40}
        height={40}
        className="object-cover rounded-full h-15 w-15 md:hidden xl:block"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name ?? 'No name available'}</h3>
        <p className="text-xs text-gray-500">{item?.email ?? 'No email available'}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.id}</td>

    {/* Directly use the strings from subjects and classes */}
    <td className="hidden md:table-cell">{item.subjects.map(subject => subject.name).join(", ")}</td>
    <td className="hidden md:table-cell">{item.classes.map(classItem => classItem.name).join(", ")}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    {/* Actions Column */}
    <td>
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

  const role = await getRole();

  const {userId} = await auth()
  
  // Define table columns
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Teacher ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
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

  const { page, ...queryParams } = searchParams;
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

  // Fetch teachers and include related fields (subjects, classes)
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
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
