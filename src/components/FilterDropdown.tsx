"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ClassType = { id: number; name: string };

const FilterDropdown = ({ classes }: { classes: ClassType[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newClassId = event.target.value;
    const params = new URLSearchParams(searchParams);
    if (newClassId) {
      params.set("classId", newClassId);
    } else {
      params.delete("classId");
    }
    router.push(`/list/students?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-auto">
      <select
        className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none"
        onChange={handleChange}
        defaultValue=""
      >
        <option value="" >
          Class
        </option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id} className="text-gray">
            {cls.name}
          </option>
        ))}
      </select>

      <span className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2">
        🔽 {/* You can replace this with an actual icon */}
      </span>
    </div>

  );
};

export default FilterDropdown;
