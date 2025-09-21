"use client";
import { LessonDay } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ClassType = {
  id: number;
  section: string | null;
  gradeId: number;
};

type GradeType = {
  id: number;
  level: string;
};

type DayFilterProps = { basePath: string };
type StatusFilterProps = { basePath: string };
type StudentStatusFilterProps = { basePath: string };

interface ClassFilterProps {
  classes: ClassType[];
  grades: GradeType[];
  basePath: string;
  showClassFilter?: boolean;
}

/* ---------------- Common Select Styles ---------------- */
const selectClasses =
  "w-full py-2 pl-4 pr-10 text-sm rounded-full appearance-none md:w-auto " +
  "border border-gray-300 text-gray-700 bg-white " +
  "focus:ring-2 focus:ring-LamaSky focus:outline-none " +
  "dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800";

/* ---------------- Class Filter ---------------- */
const ClassFilterDropdown = ({ classes, grades, basePath, showClassFilter = true }: ClassFilterProps) => {
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
          className={selectClasses}
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
      {showClassFilter && (
        <div className="relative w-full md:w-auto">
          <select
            className={selectClasses}
            onChange={handleClassChange}
            value={selectedClassId || ""}
            disabled={!selectedGradeId}
          >
            <option value="" disabled>
              Select Class
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

/* ---------------- Date Filter ---------------- */
const DateFilter = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newDate) params.set("date", newDate);
    else params.delete("date");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-auto">
      <input
        type="date"
        onChange={handleDateChange}
        className={selectClasses}
      />
    </div>
  );
};

/* ---------------- Status Filters ---------------- */
const StatusFilter = ({ basePath }: StatusFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "Status";

  useEffect(() => {
    if (!searchParams.get("status")) {
      const params = new URLSearchParams(searchParams.toString());
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, basePath, router]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus) params.set("status", newStatus);
    else params.delete("status");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full md:w-auto mt-4 md:mt-0">
      <select
        className={selectClasses}
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

const StudentStatusFilter = ({ basePath }: StudentStatusFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("studentStatus") || "ACTIVE";

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
    if (newStatus) params.set("studentStatus", newStatus);
    else params.delete("studentStatus");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full md:w-auto mt-4 md:mt-0">
      <select
        className={selectClasses}
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

/* ---------------- Gender Filter ---------------- */
const GenderFilter = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGender = searchParams.get("gender") || "";

  useEffect(() => {
    if (!searchParams.get("gender")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("gender", "");
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, basePath, router]);

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGender = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newGender) params.set("gender", newGender);
    else params.delete("gender");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full md:w-auto mt-4 md:mt-0">
      <select
        className={selectClasses}
        onChange={handleGenderChange}
        value={currentGender}
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  );
};

/* ---------------- Day Filter ---------------- */
export const getTodayLessonDay = (): LessonDay => {
  const days: LessonDay[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday
  return days[today === 0 ? 6 : today - 1];
};

const DayFilter = ({ basePath }: DayFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDay, setSelectedDay] = useState<LessonDay>(getTodayLessonDay());

  useEffect(() => {
    const dayFromUrl = searchParams.get("day") as LessonDay | null;

    if (dayFromUrl && Object.values(LessonDay).includes(dayFromUrl)) {
      setSelectedDay(dayFromUrl);
    } else {
      const today = getTodayLessonDay();
      setSelectedDay(today);
      const params = new URLSearchParams(searchParams.toString());
      params.set("day", today);
      router.replace(`${basePath}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, basePath, router]);

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = event.target.value as LessonDay;
    setSelectedDay(newDay);
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", newDay);
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full md:w-auto">
      <select
        value={selectedDay}
        onChange={handleDayChange}
        className={selectClasses}
      >
        {Object.values(LessonDay).map((day) => (
          <option key={day} value={day}>
            {day.charAt(0) + day.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

/* ---------------- Exports ---------------- */
export { DayFilter, DateFilter, StatusFilter, StudentStatusFilter, GenderFilter };
export default ClassFilterDropdown;
