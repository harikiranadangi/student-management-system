import Image from "next/image";
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";

const EventCalendarContainer = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const dateParam = Array.isArray(searchParams.date)
    ? searchParams.date[0]
    : searchParams.date;

  return (
    <div className="p-4 bg-white rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="my-4 text-xl font-semibold">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={dateParam} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
