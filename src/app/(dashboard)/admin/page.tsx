// AdminPage.js
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className='flex flex-col gap-4 p-4 md:flex-row'>
      {/* LEFT */}
      <div className='flex flex-col w-full gap-8 lg:w-2/3'>
        {/* USER CARDS */}
        <div className='flex flex-wrap justify-between gap-4'>
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className='flex gap-4 lg:flex-row'>
          {/* COUNT CHART */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className='flex flex-col w-full gap-8 lg:w-1/3'>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
