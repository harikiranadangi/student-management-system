import CountChart from "@/components/CountChart";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-2'>
        {/* USER CARDS */}
        <div className='flex gap-4 justify-between'>
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/*MIDDLE CHARTS*/}
        <div className='flex gap-4 flex-col log:flex-row'></div>
          {/*COUNT CHART*/}
          <div className='w-full lg:w-1/3 h-[450px]'>
          <CountChart />
          </div>
          {/*ATTENDANCE CHART*/}
          <div className='w-full lg:w-2/3 h-[450px]'></div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'>r</div>
    </div>
  );
};

export default AdminPage;
