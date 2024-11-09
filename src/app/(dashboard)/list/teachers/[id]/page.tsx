import Image from "next/image";

const SinglePage = () => {
  return (
    <div className="flex flex-col flex-1 gap-4 p-4 xl:flex-row">
        
        {/* LEFT: Description */}
        <div className='w-full xl:w-2/3'>
            {/* TOP */}
            <div className='flex flex-col gap-4 lg:flex-row'>
                {/* USER INFO CARD */}
                <div className='flex flex-1 gap-4 px-4 py-6 rounded-md bg-LamaSky'>
                    <div className='w-1/3'>
                    <Image src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" alt="Man in brown polo shirt" width={144} height={144} className="object-cover rounded-full w-36 h-36"/>
                    </div>
                    <div className='flex flex-col justify-between w-2/3 gap-4'>
                        <h1 className="text-xl font-semibold ">Leonard Snyder</h1>
                        <p className="text-sm text-gray-500">
                        He is a dedicated and experienced educator with over 10 years of teaching high school mathematics
                        </p>
                        <div className='flex flex-wrap items-center justify-between gap-2 text-xs font-medium'>
                            <div className='flex items-center w-full gap-2 2xl:w-1/3 lg:w-full md:w-1/3'>
                            <Image src="/blood.png" alt="" width={14} height={14}/>
                            <span>A+</span>
                            </div>
                            <div className='flex items-center w-full gap-2 2xl:w-1/3 lg:w-full md:w-1/3'>
                            <Image src="/date.png" alt="" width={14} height={14}/>
                            <span>January 2025</span>
                            </div>
                            <div className='flex items-center w-full gap-2 lg:w-full 2xl:w-1/3 md:w-1/3'>
                            <Image src="/mail.png" alt="" width={14} height={14}/>
                            <span>user@gmail.com</span>
                            </div>
                            <div className='flex items-center w-full gap-2 md:w-1/3 lg:w-full 2xl:w-1/3'>
                            <Image src="/phone.png" alt="" width={14} height={14}/>
                            <span>9874562412</span>
                            </div>    
                        </div>
                    </div>
                </div>
                {/* SMALL CARDS */}
                <div className='flex-1'></div>
            </div>
            {/* BOTTOM */}
            <div className='flex items-center w-full gap-2 md:w-1/3'>Schedule</div>
        </div>
        {/* RIGHT: Description */}
        <div className='w-full xl:w-1/3'>r</div>
        
    </div>
  );
};

export default SinglePage;