import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { assignmentsData,  role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Assignments = {
  id: number;
  subject: string;
  class: number;
  teacher : number;
  dueDate: string;
};

const columns = [
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Due date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
      },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  

const AssignmentsList = () => {
  const renderRow = (item: Assignments) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher }</td>
      <td className="hidden md:table-cell">{item.dueDate }</td>
      <td>
        <div className="flex items-center gap-2">
        {role === "admin" && (
            <>
              <FormModal table="assignment" type="update" data={item}  /> 
              <FormModal table="assignment" type="delete" id={item.id} />
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
        <h1 className="hidden text-lg font-semibold md:block">All Assignments</h1>
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
                <FormModal table="assignment" type="create" /> 
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
      {/* PAGINATION: Description */}
      <Pagination />
    </div>
  );
};

export default AssignmentsList;
