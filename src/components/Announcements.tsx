import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

const Announcements = async () => {

    const { userId } = await auth();

    const role = await getRole()

    const roleConditions = {
        admin: {},
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { lessons: { some: { id: userId! } } },
    }


    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: "desc" },
        where: {
            ...(role !== "admin" && {
                OR: [{ classId: null },
                { class: roleConditions[role as keyof typeof roleConditions] || {} },
                ],
            }),
        }
    });

    return (
        <div className="p-4 bg-white rounded-md">
            <div className='flex items-center justify-between'>
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                {data[0] && <div className='p-4 rounded-md bg-LamaSkyLight'>
                    <div className='flex items-center justify-between'>
                        <h2 className="font-medium">{data[0].title}</h2>
                        <span className="px-1 py-1 text-xs text-gray-400 bg-white rounded-md">
                            {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        {data[0].description}
                    </p>
                </div>}

                {data[1] && <div className='p-4 rounded-md bg-LamaPurple'>
                    <div className='flex items-center justify-between'>
                        <h2 className="font-medium">{data[1].title}</h2>
                        <span className="px-1 py-1 text-xs text-gray-500 bg-white rounded-md">
                            {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        {data[1].description}
                    </p>
                </div>}

                {data[2] && <div className='p-4 rounded-md bg-LamaYellow'>
                    <div className='flex items-center justify-between'>
                        <h2 className="font-medium">{data[2].title}</h2>
                        <span className="px-1 py-1 text-xs text-gray-500 bg-white rounded-md">{new Intl.DateTimeFormat("en-GB").format(data[2].date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {data[2].title}
                    </p>
                </div>}

            </div>
        </div>
    );
};

export default Announcements;