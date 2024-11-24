import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { eventsData,   role} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
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
  

  const renderRow = (item: Events) => (
    <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
      <td className="flex items-center gap-4 p-4">{item.title }</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.date }</td>
      <td className="hidden md:table-cell">{item.startTime }</td>
      <td className="hidden md:table-cell">{item.endTime}</td>
      <td>
        <div className="flex items-center gap-2">
        {role === "admin" && (
              <>
              <FormModal table="event" type="update" data={item}  /> 
              <FormModal table="event" type="delete" id={item.id}  /> 
             </>
          )}
        </div>
      </td>
    </tr>
  );

const EventsList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Initialize Prisma query object
  const query: Prisma.ResultWhereInput = {};

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = parseInt(value);
            break;
          case "search":
            query.OR = [
              { exam : {title: {contains:value}}},
              { student : {name: {contains:value}}},
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Fetch teachers and include related fields (subjects, classes)
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      // where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

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
                <FormModal table="event" type="create" /> 
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={eventsData} />
      {/* PAGINATION: Description */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EventsList;
