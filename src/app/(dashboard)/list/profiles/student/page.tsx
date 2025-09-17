"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import MessagesWrapper from "@/components/MessagesWrapper";

interface Student {
  id: string;
  name: string;
  parentName?: string;
  email?: string;
  phone?: string;
  img?: string;
  bloodType?: string;
  gender: "Male" | "Female";
  dob?: string;
  Class?: { id: number; name: string };
  profile?: { activeUserId?: string };
  linkedUser?: { username?: string; role?: string };
}

const StudentProfilePage = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch("/api/student-profile");
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Student not found</p>;

  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 p-6 bg-LamaSky rounded-md">
          <Image
            src={student.img || (student.gender === "Male" ? "/male.png" : "/female.png")}
            alt={student.name || "Student"}
            width={144}
            height={144}
            className="rounded-full w-24 h-24 object-cover"
          />
          <div className="flex flex-col justify-between gap-4">
            <h1 className="text-xl font-semibold">{student.name}</h1>
            <p className="text-sm text-gray-500">{student.parentName || "Parent info not available"}</p>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span>Blood: {student.bloodType || "N/A"}</span>
              <span>DOB: {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}</span>
              <span>Email: {student.email || "-"}</span>
              <span>Phone: {student.phone || "-"}</span>
            </div>
          </div>
        </div>

        {/* Small cards */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white p-4 rounded-md flex-1">
            <h1 className="text-xl font-semibold">{student.id}</h1>
            <span className="text-sm text-gray-400">Adm No.</span>
          </div>
          <div className="bg-white p-4 rounded-md flex-1">
            <h1 className="text-xl font-semibold">{student.Class?.name || "-"}</h1>
            <span className="text-sm text-gray-400">Class</span>
          </div>
          <div className="bg-white p-4 rounded-md flex-1">
            <Suspense fallback="loading...">
              <StudentAttendanceCard id={student.id} />
            </Suspense>
          </div>
        </div>

        {/* Schedule */}
        {student.Class?.id && (
          <div className="bg-white p-4 rounded-md mt-4 h-[800px]">
            <h1>Student's Schedule</h1>
            <BigCalendarContainer type="classId" id={student.Class.id} />
          </div>
        )}

        {/* Profile */}
        {student.profile && (
          <div className="bg-white p-4 rounded-md mt-4">
            <h1 className="text-xl font-semibold">Profile</h1>
            <p>{student.profile.activeUserId || "No bio available"}</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-4 w-full xl:w-1/3">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-LamaYellowLight" href={`/list/homeworks?classId=${student.Class?.id}`}>
              Student's Homeworks
            </Link>
            <Link className="p-3 rounded-md bg-LamaPurpleLight" href={`/list/teachers?classId=${student.Class?.id}`}>
              Student's Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${student.Class?.id}`}>
              Student's Exams
            </Link>
          </div>
        </div>
        <Performance />
        <MessagesWrapper />
      </div>
    </div>
  );
};

export default StudentProfilePage;
