import clsx from 'clsx';
import ClassFilterDropdown, { StatusFilter } from "@/components/FilterDropdown";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getGroupedStudentFees } from "@/lib/fees";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils/server-utils";
import { getTermStatus } from "@/lib/utils/getTermStatus";
import { Prisma, Student, StudentFees, StudentTotalFees } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { SearchParams } from '../../../../../../types';
import ResetFiltersButton from '@/components/ResetFiltersButton';

// Define types
type StudentList = Student & {
  Class?: { name: string };
  studentFees?: StudentFees[];
  totalFees?: StudentTotalFees | null;
};

const rawGroupedFees = await getGroupedStudentFees();

const renderRow = (item: StudentList, role: string | null) => {
  const studentFee = rawGroupedFees.find(fee => fee.studentId === item.id);

  const paidAmount = studentFee?.totalPaidAmount ?? 0;
  const abacusAmount = studentFee?.totalAbacusAmount ?? 0;
  const totalFeeAmount = studentFee?.totalFeeAmount ?? 0;
  const discountAmount = item.totalFees?.totalDiscountAmount ?? 0;
  const dueAmount = totalFeeAmount - paidAmount - abacusAmount - discountAmount;
  const isPreKg = item.Class?.name?.trim().toLowerCase() === "pre kg";

  const { status } = getTermStatus({ dueAmount, paidAmount, abacusAmount, totalFeeAmount, isPreKg });

  return (
    <tr
      key={item.id}
      className="text-sm border-b border-gray-100 dark:border-gray-700 even:bg-slate-50 dark:even:bg-gray-800 hover:bg-LamaPurpleLight dark:hover:bg-gray-700 transition-colors"
    >
      <td className="flex items-center gap-2 p-2 text-gray-800 dark:text-gray-200">
        <Image
          src={item.img || (item.gender === "Male" ? "/male.png" : "/female.png")}
          alt={item.name}
          width={40}
          height={40}
          className="object-cover w-10 h-10 rounded-full md:hidden xl:block"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name} ({item.Class?.name ?? "N/A"})</h3>
          <p className="text-xs">{item.id}</p>
        </div>
      </td>

      <td className="hidden md:table-cell text-gray-700 dark:text-gray-200">{item.gender}</td>
      <td className="hidden md:table-cell text-gray-700 dark:text-gray-200">{item.parentName || 'N/A'}</td>
      <td className="text-gray-800 dark:text-gray-200">{item.phone}</td>
      <td className="hidden md:table-cell text-gray-700 dark:text-gray-200">{paidAmount}</td>
      <td
        className={clsx(
          "hidden md:table-cell",
          status === "Fully Paid" && "text-green-600 dark:text-green-400",
          status === "Not Paid" && "text-red-600 dark:text-red-400",
          status.includes("Term") && "text-yellow-500 dark:text-yellow-400"
        )}
      >
        {status}
      </td>

      <td className="p-2">
        {role === "admin" && (
          <div className="flex items-center gap-2">
            {/* Collect Fees Button */}
            <Link href={`/list/fees/collect/${item.id}`}>
              <button className="flex items-center justify-center rounded-full w-7 h-7 bg-LamaSky dark:bg-LamaSky">
                <Image src="/view.png" alt="View" width={16} height={16} />
              </button>
            </Link>

            {/* Cancel Fees Button */}
            <Link href={`/list/fees/cancel/${item.id}`}>
              <button className="flex items-center justify-center rounded-full w-7 h-7 bg-LamaPurple dark:bg-LamaPurple">
                <Image src="/delete.png" alt="Cancel" width={16} height={16} />
              </button>
            </Link>
          </div>
        )}
      </td>
    </tr>
  );
};

const getColumns = (role: string | null) => [
  { header: "Student Name", accessor: "name" },
  { header: "Gender", accessor: "gender", className: "hidden md:table-cell" },
  { header: "Parent Name", accessor: "parentName", className: "hidden md:table-cell" },
  { header: "Mobile", accessor: "phone" },
  { header: "Fees Paid", accessor: "paidAmount", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
];

const StudentFeeListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const { page, gradeId, classId, ...queryParams } = params;
  const p = page ? (Array.isArray(page) ? page[0] : page) : "1";

  const { role, classId: teacherClassId } = await fetchUserInfo();
  const columns = getColumns(role);

  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = Array.isArray(params.sortKey) ? params.sortKey[0] : params.sortKey || "classId";

  const query: Prisma.StudentWhereInput = { status: "ACTIVE" };
  if (role === "teacher" && teacherClassId) query.classId = teacherClassId;
  else {
    if (classId) query.classId = Number(classId);
    if (gradeId) query.Class = { gradeId: Number(gradeId) };
  }

  if (queryParams.search) {
    const searchValue = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;
    query.OR = [
      { name: { contains: searchValue, mode: "insensitive" } },
      { id: { contains: searchValue } },
    ];
  }

  const classes = role === "admin" ? await prisma.class.findMany({ where: gradeId ? { gradeId: Number(gradeId) } : {} }) : [];
  const grades = role === "admin" ? await prisma.grade.findMany() : [];

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      orderBy: [{ [sortKey]: sortOrder }, { classId: "asc" }, { gender: "desc" }, { name: "asc" }],
      where: query,
      include: { Class: true, totalFees: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (parseInt(p) - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white dark:bg-gray-900 rounded-md text-black dark:text-white">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-3 flex-col md:flex-row gap-4">
        <h1 className="text-lg font-semibold">
          {role === "teacher"
            ? `Fees Collection - ${data[0]?.Class?.name ?? "Your Class"} (${count})`
            : `Fees Collection (${count})`}
        </h1>

        {role === "admin" && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
            <ClassFilterDropdown classes={classes} grades={grades} basePath="/list/fees/collect" />
            <StatusFilter basePath="/list/fees/collect" />
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <TableSearch />
              <ResetFiltersButton basePath="/list/fees/collect" />
              <div className="flex items-center gap-4">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow dark:bg-LamaYellow">
                  <Image src="/filter.png" alt="" width={14} height={14} />
                </button>
                <SortButton sortKey="id" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={data} />

      {/* Pagination */}
      <Pagination page={parseInt(p)} count={count} />
    </div>
  );
};

export default StudentFeeListPage;
