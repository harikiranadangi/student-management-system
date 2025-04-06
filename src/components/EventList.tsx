import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {

    const date = dateParam ? new Date(dateParam) : new Date()

    const data = await prisma.event.findMany({
        take:5,
        orderBy: { startTime: "desc"},
        where: {
            startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999)),
            }
        }
    })
    return data.map(event => (
        <div className='p-5 border-2 border-t-4 border-gray-100 rounded-md odd:border-t-LamaSky even:border-t-lamaPurple' 
        key={event.id}>
            <div className='flex items-center justify-between'>
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-xs text-gray-300">{event.startTime.toLocaleTimeString("en-UK",{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }

                )}</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">{event.description}</p>
        </div>
    ))
};

export default EventList;