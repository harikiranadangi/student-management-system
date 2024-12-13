import Image from "next/image"
import EventList from "./EventList";
import EventCalendar from "./EventCalendar";

const EventCalendarContainer = async ({
    searchParams,
}:{
    searchParams: { [keys: string]: string | undefined}
}) => {
    // Await searchParams before using it
    const params = await searchParams;
    const { date } = params;
    return (
        <div className="p-4 bg-white rounded-md">
            <EventCalendar/>
            <div className='flex items-center justify-between'>
                <h1 className="my-4 text-xl font-semibold">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className='flex flex-col gap-4'>
                <EventList dateParam={date}/>
            </div>
        </div>
    );
};

export default EventCalendarContainer;