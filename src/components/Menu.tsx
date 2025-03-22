import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["admin", "teacher", "student"] },
      { icon: "/teacher.png", label: "Teachers", href: "/list/teachers", visible: ["admin"] },
      { icon: "/student.png", label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: "/attendance.png", label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student"] },
      { icon: "/homework.png", label: "Homeworks", href: "/list/homeworks", visible: ["admin", "teacher", "student"] },
      { icon: "/finance.png", label: "Fees", href: "/list/fees", visible: ["admin"] },
      { icon: "/finance.png", label: "Fees Strcuture", href: "/list/feestrucute", visible: ["admin"] },
      { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin"] },
      { icon: "/lesson.png", label: "Time Table", href: "/list/lessons", visible: ["admin", "teacher", "student"] },
      { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student"] },
      { icon: "/result.png", label: "Results", href: "/list/results", visible: ["admin", "teacher", "student"] },
      { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student"] },
      { icon: "/admin.png", label: "Admin", href: "/list/admin", visible: ["admin"] },
    ],
  },
  {
    title: "OTHERS",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/list/profile", visible: ["teacher", "student"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student"] },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string || "";

  // Generate updated menu dynamically
  const updatedMenu = menuItems.map((section) => ({
    ...section,
    items: section.items
      .map((item) => {
        if (!item) return null; // Ensure item exists

        // Update "Home" link based on role
        if (item.label === "Home" && role) {
          return { ...item, href: `/${role}` };
        }

        // Update "Profile" link based on role
        if (item.label === "Profile") {
          if (role === "student") {
            return { ...item, href: "/list/studentprofile" };
          }
          if (role === "teacher") {
            return { ...item, href: "/list/teacherprofile" };
          }
          return null; // Hide Profile for admin
        }

        return item;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null) // Ensure no null values
      .filter((item) => item.visible.includes(role)), // Filter based on role
  }));

  return (
    <div className="mt-4 text-sm">
      {updatedMenu.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden my-4 mb-4 font-light text-gray-400 lg:block">
            {section.title}
          </span>
          {section.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-center gap-6 py-2 text-gray-500 rounded-md lg:justify-start md:px-4 hover:bg-LamaSkyLight"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};


export default Menu;
