import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { icon: "/home.png", label: "Home", href: "/" },
  { icon: "/teacher.png", label: "Teachers", href: "/teachers" },
  { icon: "/student.png", label: "Students", href: "/students" },
  { icon: "/parent.png", label: "Parents", href: "/parents" },
  { icon: "/subject.png", label: "Subjects", href: "/subjects" },
  { icon: "/class.png", label: "Classes", href: "/classes" },
  { icon: "/lesson.png", label: "Lessons", href: "/lessons" },
  { icon: "/exam.png", label: "Exams", href: "/exams" },
  { icon: "/assignment.png", label: "Assignments", href: "/assignments" },
  { icon: "/result.png", label: "Results", href: "/results" },
  { icon: "/attendance.png", label: "Attendance", href: "/attendance" },
  { icon: "/calendar.png", label: "Events", href: "/events" },
  { icon: "/message.png", label: "Messages", href: "/messages" },
  { icon: "/announcement.png", label: "Announcements", href: "/announcements" },
  { icon: "/profile.png", label: "Profile", href: "/profile" },
  { icon: "/setting.png", label: "Settings", href: "/settings" },
  { icon: "/logout.png", label: "Logout", href: "/logout" },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((item) => (
        <Link href={item.href} key={item.label} className="flex items-center justify-center gap-2 p-2 rounded lg:justify-start hover:bg-gray-100">
          <Image src={item.icon} alt={item.label} width={20} height={20} />
          <span className="hidden lg:block">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Menu;
