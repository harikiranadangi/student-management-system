import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className='flex flex-col gap-4 p-4 md:flex-row'>
      {/* LEFT */}
      <div className='flex flex-col w-full gap-2 lg:w-2/3'>
        {/* USER CARDS */}
        <div className='flex justify-between gap-4'>
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/*MIDDLE CHARTS*/}
        <div className='flex flex-col gap-4 log:flex-row'></div>
          {/*COUNT CHART*/}
          <div className='w-full lg:w-1/3 h-[450px]'>
          <CountChart />
          </div>
          {/*ATTENDANCE CHART*/}
          <div className='w-full lg:w-2/3 h-[450px]'>
          <AttendanceChart />
          </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'>r</div>
    </div>
  );
};

export default AdminPage;
