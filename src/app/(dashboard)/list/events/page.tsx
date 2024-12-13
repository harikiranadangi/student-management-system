import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";

type Events = Event & { class: Class };




const renderRow = (item: Events, role: string | null) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" 
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.class?.name || "-" }</td>
    <td className="hidden md:table-cell">
      {""}
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>
    <td className="hidden md:table-cell">
      {item.startTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
      )}
    </td>
    <td className="hidden md:table-cell">
      {item.endTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
      )}
    </td>
      <td>
        <div className="flex items-center gap-2">
        {role === "admin" || role === "teacher" && (
              <>
              <FormContainer table="event" type="update" data={item}/> 
              <FormContainer table="event" type="delete"  id={item.id} /> 
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

  const role = await getRole();

  const {userId} = await auth()

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
  const query: Prisma.EventWhereInput = {};

  // Dynamically add filters based on query parameters
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value }
            break;
          default:
            break;
        }
      }
    }
  }

  //  * ROLE CONDITIONS

  const roleConditions = {

    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },

  };

  query.OR = [
    { classId: null},
    {
      class: roleConditions [role as keyof typeof roleConditions] || {},
    }
  ]

  // switch(role){
  //   case "admin":
  //     break;
      
  //   case "teacher":
  //     query.OR = [
  //       { classId: null }, 
  //       { class: { lessons: { some: {teacherId: userId!}}}},
  //     ]  
  //     break;
  // }
  
  // Fetch teachers and include related fields (subjects, classes)
  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
        
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: query }),
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
            {role === "admin" || role === "teacher" && (
              <FormModal table="event" type="create" />
            )}
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

export default EventsList;
