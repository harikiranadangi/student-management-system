"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ClassType = {
  id: number;
  name: string;
  section: string | null;
  gradeId: number;
};

type GradeType = {
  id: number;
  level: string;
};

type StatusFilterProps = { basePath: string };

type StudentStatusFilterProps = { basePath: string };

interface ClassFilterProps {
  classes: ClassType[];
  grades: GradeType[];
  basePath: string;
  hideClassFilter?: boolean;
}

const ClassFilterDropdown = ({ classes, grades, basePath, hideClassFilter = true }: ClassFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGradeId = searchParams.get("gradeId");
  const selectedClassId = searchParams.get("classId");

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gradeId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (gradeId) {
      params.set("gradeId", gradeId);
      params.delete("classId");
    } else {
      params.delete("gradeId");
      params.delete("classId");
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (classId) {
      params.set("classId", classId);
    } else {
      params.delete("classId");
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  const filteredClasses = selectedGradeId
    ? classes.filter((cls) => cls.gradeId.toString() === selectedGradeId)
    : [];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Grade Dropdown */}
      <div className="relative w-full md:w-auto">
        <select
          className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
          onChange={handleGradeChange}
          value={selectedGradeId || ""}
        >
          <option value="" disabled>
            Select Grade
          </option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.level}
            </option>
          ))}
        </select>
      </div>

      {/* Class Dropdown */}
      {hideClassFilter && (
        <div className="relative w-full md:w-auto">
          <select
            className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
            onChange={handleClassChange}
            value={selectedClassId || ""}
            disabled={!selectedGradeId}
          >
            <option value="" disabled>
              {"Select Class"}
            </option>
            {filteredClasses
              .sort((a, b) => (a.section ?? "").localeCompare(b.section ?? ""))
              .map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.section}
                </option>
              ))}

          </select>
        </div>
      )}
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

export const StatusFilter = ({ basePath }: StatusFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Current status (defaults to "Not Paid")
  const currentStatus = searchParams.get("status") || "Status";

  // ✅ Ensure URL has a default status if not set
  useEffect(() => {
    if (!searchParams.get("status")) {
      const params = new URLSearchParams(searchParams.toString());
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, basePath, router]);

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
        value={currentStatus}
      >
        <option value="">Status</option>
        <option value="Not Paid">Not Paid</option>
        <option value="1 Term Paid">1 Term Paid</option>
        <option value="2 Terms Paid">2 Terms Paid</option>
        <option value="3 Terms Paid">3 Terms Paid</option>
        <option value="Fully Paid">Fully Paid</option>
      </select>
    </div>
  );
};


export const StudentStatusFilter = ({ basePath }: StudentStatusFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current status from URL (or default to ACTIVE)
  const currentStatus = searchParams.get("studentStatus") || "ACTIVE";

  // ✅ Ensure URL always has studentStatus=ACTIVE on first load
  useEffect(() => {
    if (!searchParams.get("studentStatus")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("studentStatus", "ACTIVE");
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, basePath, router]);

  const handleStudentStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus) {
      params.set("studentStatus", newStatus);
    } else {
      params.delete("studentStatus");
    }

    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full md:w-auto mt-4 md:mt-0">
      <select
        className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
        onChange={handleStudentStatusChange}
        value={currentStatus}
      >
        <option value="">All Students</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="TRANSFERRED">Transferred</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
    </div>
  );
};