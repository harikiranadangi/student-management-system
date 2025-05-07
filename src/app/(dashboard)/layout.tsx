import MenuWrapper from "@/components/MenuWrapper";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      {/* LEFT */}
      <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] '>
        <Link href="/" className="flex items-center justify-center gap-2 p-4 lg:justify-start"
        >
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <span className="hidden font-bold lg:block">Kotak Salesian School</span>
        </Link>
        <div className="pl-4">
        <MenuWrapper />
        </div>
      </div>

      {/* RIGHT */}
      <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col' >
        <Navbar />
        {children}
      </div>
    </div>
  );
}
