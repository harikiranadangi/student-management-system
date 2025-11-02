"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { dropdownUI } from "../../../types"; // uses your shared styles
import { AcademicYear } from "@prisma/client"; // ✅ import the Prisma enum

export default function AcademicYearDropdown({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedYear = searchParams.get("academicYear") || "";

  // Convert enum to dropdown list
  const years = Object.values(AcademicYear).map((value) => ({
    value,
    label: value.replace("Y", "").replace("_", "-"), // Example: Y2024_2025 → 2024-2025
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (year) params.set("academicYear", year);
    else params.delete("academicYear");

    // Reset pagination to page 1 when filter changes
    params.delete("page");

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-auto">
      <select
        className={`${dropdownUI} dark:bg-gray-800 dark:text-white`}
        onChange={handleChange}
        value={selectedYear}
      >
        <option value="">Select Academic Year</option>
        {years.map((y) => (
          <option key={y.value} value={y.value}>
            {y.label}
          </option>
        ))}
      </select>
    </div>
  );
}
