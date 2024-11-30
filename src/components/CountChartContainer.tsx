import Image from "next/image";
import CountChart from "./CountChart"
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
    const data = await prisma.student.groupBy({
        by:["gender"],
        _count: true
    })

    console.log(data)

    const male = data.find( d=> d.gender === "Male")?._count || 0;
    const female = data.find( d=> d.gender === "Female")?._count || 0;
    
    return (
        <div className="w-full h-full p-4 bg-white rounded-xl">
            {/* TITLE */}
            <div className="flex items-center justify-between ">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="More options" width={20} height={20} />
            </div>
            {/* CHART */}

            <CountChart male={male} female={female}/>
            {/* BOTTOM SECTION */}
            <div className='flex justify-center gap-16 '>
                <div className='flex flex-col items-center'>
                    <div className='w-5 h-5 rounded-full bg-LamaSky' />
                    <h1 className="font-bold">{male}</h1>
                    <h2 className="text-xs text-gray-300">Boys { Math.round(male/(male+female) * 100)}%</h2>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='w-5 h-5 rounded-full bg-LamaYellow' />
                    <h1 className="font-bold">{female}</h1>
                    <h2 className="text-xs text-gray-300">Girls { Math.round(female/(male+female) * 100)}%</h2>
                </div>
            </div>
        </div>
    );
};

export default CountChartContainer;