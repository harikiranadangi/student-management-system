import ClassFilterDropdown from "@/components/FilterDropdown";
import Pagination from "@/components/Pagination";
import SortButton from "@/components/SortButton";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getGroupedStudentFees } from "@/lib/fees";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { fetchUserInfo } from "@/lib/utils";
import { FeeStructure, Prisma, StudentFees, StudentTotalFees } from "@prisma/client";
import Image from "next/image";

// Define types
type StudentFeeReportList = {
  id: string;
  name: string;
  username: string;
  parentName: string | null;
  img: string | null;
  dob: string;
  phone: string | null;
  gender: string | null;
  studentFees?: (StudentFees & { feeStructure?: FeeStructure })[];
  // ⬇️ New: StudentTotalFees model added here
  studentTotalFees?: StudentTotalFees | null;
  Class?: {
    name: string;
    Grade?: {
      name: string;
      feestructure?: FeeStructure[];
    };
  };
};

const rawGroupedFees = await getGroupedStudentFees();

// Function to render a table row
const renderRow = (item: StudentFeeReportList, role: string | null) => {
  const studentFee = rawGroupedFees.find(fee => fee.studentId === item.id);

  const totalFees = item.Class?.Grade?.feestructure?.reduce((acc, fee) => {
    // Add termFees and abacusFees, ensuring both are numbers (default to 0 if undefined)
    return acc + (fee.termFees ?? 0) + (fee.abacusFees ?? 0);
  }, 0) || 0;

  const paidAmount = studentFee?.totalPaidAmount ?? 0;
  const discountAmount = studentFee?.totalDiscountAmount ?? 0; // Get discount amount
  const dueAmount = Math.max(totalFees - paidAmount - discountAmount, 0);

  console.log("Item:", item);
  console.log("Class:", item.Class);
  console.log("Grade:", item.Class?.Grade);
  console.log("FeeStructure:", item.Class?.Grade?.feestructure);


  console.log("Total Fees:", totalFees);
  console.log("Paid Amount:", paidAmount);
  console.log("Discount Amount:", discountAmount);
  console.log("due Amount:", dueAmount);

  return (
    <tr
      key={item.id}
      className="text-sm border-b border-gray-100 even:bg-slate-50 hover:bg-LamaPurpleLight"
    >
      <td className="flex items-center gap-2 p-2">
        <Image
          src={item.img || "/profile.png"}
          alt={item.name}
          width={40}
          height={40}
          className="object-cover w-10 h-10 rounded-full md:hidden xl:block"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs">{item.id}</p>
        </div>
      </td>

      <td>{item.Class?.name ?? "N/A"}</td>
      <td className="hidden md:table-cell">{item.parentName || 'N/A'}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{totalFees}</td>
      <td className="hidden md:table-cell">{paidAmount}</td>
      <td className="hidden md:table-cell">{discountAmount}</td>
      <td className="hidden md:table-cell">{dueAmount}</td>
    </tr>
  );
};

const getColumns = (role: string | null) => [
  { header: "Student Name", accessor: "name" },
  { header: "Class", accessor: "class" },
  { header: "Parent Name", accessor: "parentName" },
  { header: "Mobile", accessor: "phone" },
  { header: "Total Fees", accessor: "totalFees" },
  { header: "Paid", accessor: "paidAmount" },
  { header: "discount Amount", accessor: "discountAmount" },
  { header: "due Amount", accessor: "dueAmount" },
];


const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const { page, gradeId, classId, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  // Fetch user info and role
  const { role } = await fetchUserInfo();

  const columns = getColumns(role);

  // Sorting
  const sortOrder = params.sort === "desc" ? "desc" : "asc";
  const sortKey = params.sortKey || "classId";

  // ✅ Build query properly
  const query: Prisma.StudentWhereInput = {};

  if (classId) {
    query.classId = Number(classId);  // ✅ Direct classId filter
  }

  if (gradeId) {
    query.Class = { gradeId: Number(gradeId) };  // ✅ gradeId through Class relation
  }

  // ✅ Search logic
  if (queryParams.search) {
    query.OR = [
      { name: { contains: queryParams.search, mode: "insensitive" } },
      { id: { contains: queryParams.search } },
    ];
  }

  // Fetch classes list (for dropdown etc.)
  const classes = await prisma.class.findMany({
    where: gradeId ? { gradeId: Number(gradeId) } : {},
  });

  // Fetch grades list
  const grades = await prisma.grade.findMany();

  // Fetch students data + count (Pagination)
  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      orderBy: [
        { [sortKey]: sortOrder },
        { classId: "asc" },
        { gender: "desc" },
        { name: "asc" },
      ],
      where: query,
      include: {
        Class: {
          include: {
            Grade: {
              include: {
                feestructure: true, // Include feeStructure in Grade
              },
            },
          },
        },
        totalFees: true, // Include totalFees data
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);


  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Students ({count})</h1>

        <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
          <ClassFilterDropdown classes={classes} grades={grades} basePath="/list/reports/fees-report" />
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <TableSearch />
            <div className="flex items-center self-end gap-4">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <SortButton sortKey="id" />
              <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
                {/* Use the DownloadExcelReport component */}
                {/* <DownloadExcelReport reportData={} fileName="StudentsReport" /> */}
              </div>
            </div>
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

export default StudentListPage;
