import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resultsData,  role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Results = {
  id: number;
  subject: string;
  class: number;
  student: string
  teacher : string;
  date: string;
  type: "exam" | "assignment";
  score: number;
};

const columns = [
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "Student",
      accessor: "student",
      className: "hidden md:table-cell",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
     header: "Date",
     accessor: "date",
     className: "hidden md:table-cell",
    },
    {
      header: "Type",
      accessor: "type",
      className: "hidden md:table-cell",
    },
    
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  

const ResultsList = () => {
  const renderRow = (item: Results) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td >{item.student }</td>
      <td className="hidden md:table-cell">{item.score }</td>
      <td className="hidden md:table-cell">{item.teacher }</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.date }</td>
      <td>
        <div className="flex items-center gap-2">
        {role === "admin" && (
            <>
              <FormModal table="student" type="update" data={item} className="p-2 text-white rounded-full bg-LamaSky" /> 
              <FormModal table="student" type="delete" id={item.id} className="p-2 text-white rounded-full bg-LamaPurple" />
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
        <h1 className="hidden text-lg font-semibold md:block">All Results</h1>
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
                <FormModal table="student" type="create" className="p-2 text-white rounded-full bg-LamaYellow" /> 
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={resultsData} />
      {/* PAGINATION: Description */}
      <Pagination />
    </div>
  );
};

export default ResultsList;
