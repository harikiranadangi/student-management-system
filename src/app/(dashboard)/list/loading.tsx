"use client"; // Ensure it's a client component

import { usePathname } from "next/navigation";

const Loading = () => {
  const pathname = usePathname();

  // Determine loading message based on pathname
  let message = "Loading...";
  if (pathname.includes("/students")) message = "Students Loading...";
  else if (pathname.includes("/teachers")) message = "Teachers Loading...";
  else if (pathname.includes("/classes")) message = "Classes Loading...";
  else if (pathname.includes("/admin")) message = "Dashboard Loading...";
  else if (pathname.includes("/attendance")) message = "Attendance Loading...";
  else if (pathname.includes("/homeworks")) message = "Homeworks   Loading...";
  else if (pathname.includes("/fees")) message = "Fees List Loading...";
  else if (pathname.includes("/subjects")) message = "Subjects Loading...";
  else if (pathname.includes("/lessons")) message = "Lessons Loading...";
  else if (pathname.includes("/exams")) message = "Exams Loading...";
  else if (pathname.includes("/results")) message = "Results Loading...";
  else if (pathname.includes("/events")) message = "Events Loading...";
  else if (pathname.includes("/announcements")) message = "Announcements Loading...";

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 transition-opacity animate-fadeIn">
      <div className="w-12 h-12 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
      <div className="text-lg font-semibold text-gray-700">{message}</div>
    </div>
  );
};

export default Loading;
