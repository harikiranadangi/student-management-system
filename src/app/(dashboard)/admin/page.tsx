// app/(dashboard)/admin/page.tsx
import Messages from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

const AdminPage = ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">

      {/* LEFT */}
      <div className="flex flex-col w-full gap-8 lg:w-2/3">

        {/* USER CARDS */}
        <div className="flex flex-wrap justify-between gap-4">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 lg:flex-row">

          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>

        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col w-full gap-8 lg:w-1/3">
        <EventCalendarContainer searchParams={searchParams} />
        <Messages />
      </div>

    </div>
  );
};

export default AdminPage;
