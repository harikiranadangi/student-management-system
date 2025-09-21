import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    take: 5,
    orderBy: { startTime: "desc" },
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  return data.map((event) => (
    <div
      key={event.id}
      className="p-5 rounded-md border-t-4 border-gray-200 dark:border-gray-700 odd:border-t-LamaSky even:border-t-LamaPurple bg-white dark:bg-gray-900"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-black dark:text-black">{event.title}</h1>
        <span className="text-xs text-black dark:text-black">
          {event.startTime.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-sm text-black dark:text-black">{event.description}</p>
    </div>
  ));
};

export default EventList;
