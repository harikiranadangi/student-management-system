// src/components/StudentList.tsx
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Student = {
  id: number;
  studentId: string;
  name: string;
  branch: string;
  class: string;
  gender: string;
  parentName: string;
  dob: string;
  mobile: string;
  religion: string;
  caste: string;
  language: string;
};

const columns = [
  { header: "Id", accessor: "studentId", className: "hidden md:table-cell" },
  { header: "Student Name", accessor: "name" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Gender", accessor: "gender", className: "hidden lg:table-cell" },
  { header: "Parent Name", accessor: "parentName", className: "hidden lg:table-cell" },
  { header: "DOB", accessor: "dob", className: "hidden lg:table-cell" },
  { header: "Mobile", accessor: "mobile", className: "hidden lg:table-cell" },
  { header: "Religion", accessor: "religion", className: "hidden lg:table-cell" },
  { header: "Caste", accessor: "caste", className: "hidden lg:table-cell" },
  { header: "Language", accessor: "language", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const StudentList = () => {
  const renderRow = (item: Student) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight">
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="font-semibold">{item.name}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden lg:table-cell">{item.gender}</td>
      <td className="hidden lg:table-cell">{item.parentName}</td>
      <td className="hidden lg:table-cell">{item.dob}</td>
      <td className="hidden lg:table-cell">{item.mobile}</td>
      <td className="hidden lg:table-cell">{item.religion}</td>
      <td className="hidden lg:table-cell">{item.caste}</td>
      <td className="hidden lg:table-cell">{item.language}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="parent" type="update" data={item}  />
              <FormModal table="parent" type="delete" id={item.id}  />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Students</h1>
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
              <FormModal table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={studentsData} />
      {/* PAGINATION: Description */}
      <Pagination />
    </div>
  );
};

export default StudentList;
