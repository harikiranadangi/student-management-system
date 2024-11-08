import TableSearch from "@/components/TableSearch";
import Image from "next/image";

const TeacherList = () => {
  return (
    <div className="flex-1 p-4 m-4 mt-0 bg-white rounded-md">
      {/* TOP: Description */}
      <div className='flex items-center justify-between'>
        <h1 className="hidden text-lg font-semibold md:block">All Teachers</h1>
        <div className='flex flex-col items-center w-full gap-4 md:flex-row md:w-auto'>
          <TableSearch  />
          <div className='flex items-center self-end gap-4'>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-LamaYellow">
              <Image src="/create.png" alt="" width={14} height={14} />
            </button>
          
          </div>
      </div>
      </div>
      {/* LIST: Description */}
      <div className=''></div>
      {/* PAGINATIOM: Description */}
      <div className=''></div>

    </div>
  );
};

export default TeacherList;