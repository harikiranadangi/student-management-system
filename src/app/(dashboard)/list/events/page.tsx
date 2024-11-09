import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { eventsData,   role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Events = {
      id: number,
      title: string,
      class: string,
      date: string,
      startTime: string,
      endTime: string,
    }

const columns = [
    {
      header: "Title",
      accessor: "title",
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
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  

const EventsList = () => {
  const renderRow = (item: Events) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.title }</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.date }</td>
      <td className="hidden md:table-cell">{item.startTime }</td>
      <td className="hidden md:table-cell">{item.endTime}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="flex items-center justify-center rounded-full w-7 h-7 bg-LamaSky">
              <Image src="/update.png" alt="Edit" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <button className="flex items-center justify-center rounded-full w-7 h-7 bg-LamaPurple">
              <Image src="/delete.png" alt="" width={16} height={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Events</h1>
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
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
                    <Image src="/create.png" alt="" width={14} height={14} />
                </button>
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={eventsData} />
      {/* PAGINATION: Description */}
      <Pagination />
    </div>
  );
};

export default EventsList;
