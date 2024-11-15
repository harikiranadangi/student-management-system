"use server";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type TeachersList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = (item: TeachersList ) => (
  <tr key={item.id} className="text-sm border-b border-gray-200 even:bg-slate-50 hover:bg-LamaPurpleLight" >
    <td className="flex items-center gap-4 p-4">
      <Image src={item.img || "/parent.png"} alt="" width={40} height={40} className="object-cover rounded-full h-15 w-15 md:hidden xl:block"/>
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">{item.subjects.map(SubjectItem=>SubjectItem.name).join(",")}</td>
    <td className="hidden md:table-cell">{item.classes.map(ClassItem=>ClassItem.name).join(",")}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
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

const TeacherList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Ensure `page` is parsed safely
  const pageParam = searchParams.page;
  const page = pageParam && !isNaN(Number(pageParam)) ? parseInt(pageParam) : 1;
  const p = page < 1 ? 1 : page; // Ensure `p` is a positive integer

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where:{
        lessons:{
          some:{classId:parseInt(searchParams.classId!)}
        }
      },
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count(),
  ]);
    

  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Teachers</h1>
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
                <FormModal table="teacher" type="create"/> 
            )}
          </div>
        </div>
      </div>
      {/* LIST: Description */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION: Description */}
      <Pagination page={p} count={count}/>
    </div>
  );
};

export default TeacherList;
