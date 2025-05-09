import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const Navbar = async () => {

  const user = await currentUser();
  

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'> 
        <Image src="/search.png" alt="Search" width={14} height={14} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-[200px] p-2 bg-transparent outline-none" 
        />
      </div>

      {/* THEME TOGGLE */}
            <div className='flex items-center justify-end w-full gap-10'>
        <div className='flex items-center justify-center bg-white rounded-full cursor-pointer w-6 h-6'> 
      <ThemeToggle />
        </div>
      </div>
      
      {/* ICONS AND USER */}
      <div className='flex items-center justify-end w-full gap-6'>
        <div className='flex items-center justify-center bg-white rounded-full cursor-pointer w-7 h-7'> 
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>
        
        <div className='relative flex items-center justify-center bg-white rounded-full cursor-pointer w-7 h-7'> 
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className='absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-purple-500 rounded-full -top-3 -right-3'>1</div>
        </div>
        
        <div className='flex flex-col'>
          <span className="text-xs font-medium leading-3">{user?.fullName}</span>
          <span className="text-[10px] text-gray-500 text-right">{user?.publicMetadata.role as string}</span>
        </div>
        {/*<Image src="/avatar.png" alt="User Avatar" width={36} height={36} className="rounded-full" />*/}
        <UserButton/>
      </div>
    </div>
  );
};

export default Navbar;
