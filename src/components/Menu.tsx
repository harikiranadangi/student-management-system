'use client';

import Image from "next/image";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { useTranslation } from "next-i18next";

type Role = "admin" | "teacher" | "student";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  visible: Role[];
  dropdown?: MenuItem[];
}

interface MenuItemSection {
  title: string;
  items: MenuItem[];
}

interface MenuProps {
  role: Role;
}

const menuItems: MenuItemSection[] = [
  {
    title: "",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["admin", "teacher", "student"] },
      {
        icon: "/profile.png",
        label: "Users",
        href: "#",
        visible: ["admin", "teacher"],
        dropdown: [
          { icon: '/student.png', label: "Students", href: "/list/users/students", visible: ["admin", "teacher"] },
          { icon: '/teacher.png', label: "Teachers", href: "/list/users/teachers", visible: ["admin"] },
          { icon: '/admin.png', label: "Admins", href: "/list/users/admin", visible: ["admin"] },
        ],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "#",
        visible: ["admin"],
        dropdown: [
          { icon: '/lesson.png', label: "Mark Attendance", href: "/list/attendance/mark_attendance", visible: ["admin", "teacher"] },
          { icon: '/attendance.png', label: "View Attendance", href: "/list/attendance/view", visible: ["admin", "teacher"] },
        ],
      },
      { icon: "/homework.png", label: "Homeworks", href: "/list/homeworks", visible: ["admin", "teacher", "student"] },
      {
        icon: "/fees.png",
        label: "Fees",
        href: "#",
        visible: ["admin"],
        dropdown: [
          { icon: "/fees.png", label: "Fee Collection", href: "/list/fees/collect", visible: ["admin"] },
          { icon: "/student.png", label: "Student Fee Report", href: "/list/reports/student-fees", visible: ["admin"] },
          { icon: "/report.png", label: "Day Wise Report", href: "/list/reports/daywise-fees", visible: ["admin"] },
          { icon: "/edit.png", label: "Fee Management", href: "/list/fees/feemanagement", visible: ["admin"] },
        ],
      },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student"] },
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "student"] },
      { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin"] },
      { icon: "/lesson.png", label: "Time Table", href: "/list/lessons", visible: ["admin", "teacher", "student"] },
      { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student"] },
      {
        icon: "/result.png",
        label: "Results",
        href: "#",
        visible: ["admin"],
        dropdown: [
          { icon: "/result.png", label: "View Results", href: "/list/results/view", visible: ["admin", "student", "teacher"] },
          { icon: "/lesson.png", label: "Marks Entry", href: "/list/results/marks-entry", visible: ["admin","teacher"] },
        ],
      },
      { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student"] },
    ],
  },
  {
    title: "OTHERS",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/list/profile", visible: ["teacher", "student", "admin"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student"] },
    ],
  },
];

function updateMenuItem(item: MenuItem, role: Role): MenuItem | null {
  if (item.label === "Home") {
    return { ...item, href: `/${role}` };
  }

  if (item.label === "Profile") {
    const profileHref = {
      student: "/list/studentprofile",
      teacher: "/list/teacherprofile",
      admin: "/list/adminprofile",
    }[role];
    return { ...item, href: profileHref };
  }

  const dropdown = item.dropdown?.filter(sub => sub.visible.includes(role));
  if (item.dropdown && (!dropdown || dropdown.length === 0)) return null;

  return { ...item, dropdown };
}

export default function Menu({ role }: MenuProps) {
  const { t } = useTranslation();

  const updatedMenu = menuItems
    .map((section) => {
      const filteredItems = section.items
        .map((item) => updateMenuItem(item, role))
        .filter((item): item is MenuItem => !!item)
        .filter((item) => item.visible.includes(role));

      if (filteredItems.length === 0) return null;

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section): section is MenuItemSection => section !== null);

  return (
    <div className="mt-4 text-sm">
      {updatedMenu.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          {section.title && (
            <span className="hidden my-4 mb-4 font-light text-black-400 lg:block">
              {t(section.title)}
            </span>
          )}
          {section.items.map((item) =>
            item.dropdown ? (
              <Dropdown key={item.label} icon={item.icon} label={t(item.label)} items={item.dropdown} />
            ) : (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center gap-6 py-2 text-black-500 rounded-md lg:justify-start md:px-4 hover:bg-LamaSkyLight"
              >
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span className="hidden lg:block">{t(item.label)}</span>
              </Link>
            )
          )}
        </div>
      ))}
    </div>
  );
}
