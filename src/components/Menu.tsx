import {  currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./Dropdown";

const menuItems: MenuItemSection[] = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["admin", "teacher", "student"] },
      // 🎯 DROPDOWN FOR STUDENTS
      {
        icon: "/profile.png",
        label: "Users",
        href: "#", // Placeholder for dropdown
        visible: ["admin"],
        dropdown: [
          { icon: '/student.png', label: "Students", href: "/list/users/students", visible: ["admin"] },
          { icon: '/teacher.png', label: "Teachers", href: "/list/users/teachers", visible: ["admin"] },
          { icon: '/admin.png', label: "Admins", href: "/list/users/admin", visible: ["admin"] },
        ],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "#", // Placeholder for dropdown
        visible: ["admin"],
        dropdown: [
          { icon: '/attendance.png', label: "Mark Attendance", href: "/list/attendance/mark_attendance", visible: ["admin","teacher"] },
          { icon: '/attendance.png', label: "view", href: "/list/attendance/view", visible: ["admin","teacher"] },
        ],
      },
      {
        icon: "/finance.png",
        label: "Fees",
        href: "#", // Placeholder for dropdown
        visible: ["admin"],
        dropdown: [
          { icon: "/collection.png", label: "Fee Collection", href: "/list/fees/collect", visible: ["admin"] },
          { icon: "/structure.png", label: "Fee Management", href: "/list/fees/feemanagement", visible: ["admin"] },
        ],
      },
      {
        icon: "/finance.png",
        label: "Reports",
        href: "#", // Placeholder for dropdown
        visible: ["admin"],
        dropdown: [
          { icon: "/collection.png", label: "Student Fee Report", href: "/list/reports/student-fees", visible: ["admin"] },
          { icon: "/structure.png", label: "Day Wise Report", href: "/list/reports/daywise-fees", visible: ["admin"] },
        ],
      },
      { icon: "/homework.png", label: "Homeworks", href: "/list/homeworks", visible: ["admin", "teacher", "student"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student"] },
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "student"] },
      { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin"] },
      { icon: "/lesson.png", label: "Time Table", href: "/list/lessons", visible: ["admin", "teacher", "student"] },
      { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student"] },
      { icon: "/result.png", label: "Results", href: "/list/results", visible: ["admin", "teacher", "student"] },
      { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student"] },
    ],
  },
  {
    title: "OTHERS",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/list/profile", visible: ["teacher", "student","admin"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student"] },
    ],
  },
];

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  visible: string[];
  dropdown?: MenuItem[]; // Dropdown is an array of MenuItem
}

interface MenuItemSection {
  title: string;
  items: MenuItem[];
}

// 🔹 Helper function to modify menu items dynamically
const updateMenuItem = (item: MenuItem, role: string): MenuItem | null => {
  if (!item) return null;

  // Update "Home" link based on role
  if (item.label === "Home" && role) {
    return { ...item, href: `/${role}` };
  }

  // Update "Profile" link based on role
  if (item.label === "Profile") {
    if (role === "student") return { ...item, href: "/list/studentprofile" };
    if (role === "teacher") return { ...item, href: "/list/teacherprofile" };
    if (role === "admin") return { ...item, href: "/list/adminprofile" }; // ✅ Fix: Admin profile
  }

  return item;
};


const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string || "";

  // 🔹 Generate updated menu dynamically
  const updatedMenu = menuItems.map((section) => ({
    ...section,
    items: section.items
      .map((item) => updateMenuItem(item, role)) // Apply helper function
      .filter((item): item is NonNullable<typeof item> => item !== null) // Remove null values
      .filter((item) => item.visible.includes(role)), // Filter based on role
  }));

  return (
    <div className="mt-4 text-sm">
      {updatedMenu.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden my-4 mb-4 font-light text-gray-400 lg:block">
            {section.title}
          </span>
          {section.items.map((item) =>
            item.dropdown ? (
              // Render Dropdown for items that have a "dropdown" array
              <Dropdown key={item.label} icon={item.icon} label={item.label} items={item.dropdown} />
            ) : (
              // Render Normal Menu Item
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
