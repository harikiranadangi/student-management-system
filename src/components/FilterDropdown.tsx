"use client";
import { useRouter, useSearchParams } from "next/navigation";

type ClassType = { id: number; name: string };
type GradeType = { id: number; level: string };

interface ClassFilterProps {
  classes: ClassType[];
  grades: GradeType[];
  basePath: string; // Dynamic base path (e.g., "/list/students" or "/list/teachers")
}

const ClassFilterDropdown = ({ classes, grades, basePath }: ClassFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newClassId = event.target.value;
    const params = new URLSearchParams(searchParams.toString()); // Ensure it is up to date

    if (newClassId) {
      params.set("classId", newClassId);
    } else {
      params.delete("classId");
    }

    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGradeId = event.target.value;
    const params = new URLSearchParams(searchParams); // Fix: use `searchParams`
  
    if (newGradeId) {
      params.set("gradeId", newGradeId); // Fix: Use correct key
    } else {
      params.delete("gradeId");
    }
  
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };
  
  return (
    <div className="flex space-x-4">
      <div className="relative w-full md:w-auto">
        <select
          className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
          onChange={handleGradeChange}
          value={searchParams.get("gradeId") || ""} // Updated to match query parameter
        >
          <option value="">Grade</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.level}
            </option>
          ))}
        </select>
      </div>

      <div className="relative w-full md:w-auto">
        <select
          className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
          onChange={handleClassChange}
          value={searchParams.get("classId") || ""} // Ensure correct selected value
        >
          <option value="">Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id} className="text-gray">
              {cls.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClassFilterDropdown;


// Date Filter Component
const DateFilter = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const params = new URLSearchParams(searchParams);
    if (newDate) {
      params.set("date", newDate);
    } else {
      params.delete("date");
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-auto">
      <input
        type="date"
        onChange={handleDateChange}
        className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
      />
    </div>
  );
};

export { DateFilter };

type StatusFilterProps = { basePath: string };

export const StatusFilter = ({ basePath }: StatusFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus) {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full md:w-auto mt-4 md:mt-0">
      <select
        className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
        onChange={handleStatusChange}
        value={searchParams.get("status") || ""}
      >
        <option value="">Status</option>
        <option value="Fully Paid">Fully Paid</option>
        <option value="3 Terms Paid">3 Terms Paid</option>
        <option value="2 Terms Paid">2 Terms Paid</option>
        <option value="1 Term Paid">1 Term Paid</option>
        <option value="Not Paid">Not Paid</option>
      </select>
    </div>
  );
};
