"use server";

import React from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";

// Define types
type TeachersList = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  img: string | null;
  teacherSubjects: { subject: { name: string } }[]; // Relation with subjects
  classes: { name: string }[]; // Relation with classes
};

// Define table columns
const columns = [
  { header: "Info", accessor: "info" },
  { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

// Function to render a table row
const renderRow = (item: TeachersList, role: string) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
    {/* Info Column */}
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || "/profile.png"}
        alt={`Profile image of ${item.name}`}
        width={40}
        height={40}
        className="object-cover rounded-full h-15 w-15 md:hidden xl:block"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>

    {/* Teacher ID Column */}
    <td className="hidden md:table-cell">{item.username}</td>

    {/* Subjects Column */}
    <td className="hidden md:table-cell">
      {item.teacherSubjects.map((ts) => ts.subject.name).join(", ")}
    </td>

    {/* Classes Column */}
    <td className="hidden md:table-cell">
      {item.classes.map((cls) => cls.name).join(", ")}
    </td>

    {/* Phone Column */}
    <td className="hidden lg:table-cell">{item.phone}</td>

    {/* Address Column */}
    <td className="hidden lg:table-cell">{item.address}</td>

    {/* Actions Column */}
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="teacher" type="update" data={item} />
            <FormModal table="teacher" type="delete" id={item.id} />
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
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  
  // URL PARAM CONDITION
  const query: Prisma.TeacherWhereInput = {};

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
        }
      }
    }
  }

  // Fetch teachers and total count from Prisma (directly within the component)
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        teacherSubjects: { include: { subject: true } },
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
            <FormModal table="teacher" type="create" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table columns={columns} renderRow={(item) => renderRow(item, "admin")} data={data} />

      {/* Pagination Section */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
