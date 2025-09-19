"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TeacherFilterDropdown({
  teachers,
}: {
  teachers: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTeacherId = searchParams.get("teacherId") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (teacherId) {
      params.set("teacherId", teacherId);
      params.delete("classId"); // remove class filter if switching to teacher
    } else {
      params.delete("teacherId");
    }

    router.push(`/list/lessons?${params.toString()}`);
  };

  return (
    <select
      className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
      onChange={handleChange}
      value={selectedTeacherId}
    >
      <option value="">Select Teacher</option>
      {teachers.map((teacher) => (
        <option key={teacher.id} value={teacher.id}>
          {teacher.name}
        </option>
      ))}
    </select>
  );
}
