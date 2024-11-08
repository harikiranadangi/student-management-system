import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";

const ParentPage = () => {
  return (
    <div className="flex flex-col flex-1 gap-4 p-4 xl:flex-row">
      {/* LEFT: Description */}
      <div className='w-full xl:w-2/3'>
        <div className='h-full p-4 bg-white rounded-md'>
          <h1 className="text-xl font-semibold">Schedule (Aswini)</h1>
          <BigCalendar/>
        </div>
      </div>
      {/* RIGHT: Description */}
        <div className='flex flex-col w-full gap-8 xl:w-1/3'>
        <Announcements />
        </div>
    </div>
  );
};

export default ParentPage;