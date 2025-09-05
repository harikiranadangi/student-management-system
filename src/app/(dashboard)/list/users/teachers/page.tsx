export const dynamic = "force-dynamic";
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
import { SearchParams } from "../../../../../../types";
import SortButton from "@/components/SortButton";
import ResetFiltersButton from "@/components/ResetFiltersButton";
import { GenderFilter } from "@/components/FilterDropdown";

// Define types
type TeachersList = Teacher & {
  subjects: { Subject: Subject }[]; // ✅ Fetches Subject details
  class?: Class & { students: Student[] } | null; // ✅ Fetch multiple classes with students
};

// Function to render a table row
const renderRow = (item: TeachersList, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">

    {/* Info Column */}
    <td className="flex items-center gap-2 p-2">
      {/* Use a default image if item.img is not available */}
      <Image
        src={item.img || (item.gender === "Male" ? "/maleteacher.png" : "/femaleteacher.png")}
        alt={item.name}
        width={40}
        height={40}
        className="object-cover w-10 h-10 rounded-full md:hidden xl:block"
      />
      <div className="flex flex-col ">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs">{item?.id}</p>
      </div>
    </td>

    {/* Directly use the strings from subjects and classes */}
    <td className="hidden w-32 md:table-cell">{item.class ? item.class.name : "No Class"}</td>
    <td className="px-2 w-36 md:table-cell">{item.phone}</td>
    {/* <td className="hidden w-32 truncate md:table-cell">
      {item.subjects?.map((ts) => ts.Subject?.name).join(", ") || "No subjects"}
    </td> */}
    <td className="hidden md:table-cell">{item.gender}</td>
    <td className="hidden md:table-cell">{item.dob ? new Date(item.dob).toLocaleDateString() : "N/A"}</td>
    <td className="hidden md:table-cell">{item.address}</td>

    {/* Actions Column */}
    <td className="p-2">
      <div className="flex items-center gap-2">
        <Link href={`/list/users/teachers/${item.id}`}>
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

// Define table columns
const getColumns = (role: string | null) => [
  { header: "Name", accessor: "info" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "lg:table-cell" },
  // { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Gender", accessor: "gender", className: "hidden md:table-cell" },
  { header: "DOB", accessor: "dob", className: "hidden md:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action", },] : []),];


const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {

  // Fetch user info and role
  const { role } = await fetchUserInfo();

  const columns = getColumns(role);

  // Await the searchParams first
  const params = await searchParams;
  const { page, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  // Initialize Prisma query object
  const query: Prisma.TeacherWhereInput = {};

  // Normalize value to string
  const normalize = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) return value[0];
    return value;
  };

  // Sorting
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = Array.isArray(params.sortKey) ? params.sortKey[0] : params.sortKey || "id";
  const search = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;
  const teacher = Array.isArray(queryParams.teacherId) ? queryParams.teacherId[0] : queryParams.teacherId;


  // Inside the loop
  for (const [key, value] of Object.entries(queryParams)) {
    const normalizedValue = normalize(value);
    if (normalizedValue !== undefined && normalizedValue !== "") {
      switch (key) {
        case "classId":
          query.classId = parseInt(normalizedValue);
          break;

        case "search":
          query.OR = [
            { name: { contains: normalizedValue, mode: "insensitive" } },
            { class: { name: { contains: normalizedValue, mode: "insensitive" } } }
          ];
          break;

        case "gender":   // 👈 Add this
          query.gender = normalizedValue as any; // Prisma expects Gender enum
          break;

        default:
          break;
      }
    }
  }


  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      orderBy: [
        { [sortKey]: sortOrder }],
      where: query,
      include: {
        subjects: {
          include: {
            subject: true, // Fetch Subject details
          },
        },
        class: {
          include: {
            students: true, // Fetch students in the class
            Grade: {
              include: {
                examGradeSubjects: { // Join through ExamGradeSubject
                  include: {
                    Exam: true, // Fetch related exams
                  },
                },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.teacher.count({ where: query }), // Count teachers for pagination
  ]);


 const Path = "/list/users/teachers" 

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Teachers ({count})</h1>
        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <TableSearch />
          <GenderFilter basePath={Path} />

          {/* 🔄 Reset Filters Button */}
          <ResetFiltersButton basePath={Path}  />
          <div className="flex items-center self-end gap-4">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <SortButton sortKey="id" />
            <FormContainer table="teacher" type="create" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      {/* Pagination Section */}
      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default TeacherListPage;
