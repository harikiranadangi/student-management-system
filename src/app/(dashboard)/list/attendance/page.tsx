"use client";
import { useState } from "react";

const MarkAttendance = () => {
  const [filters, setFilters] = useState({
    school: "",
    syllabus: "",
    branch: "",
    class: "",
    section: "",
    religion: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFindUsers = () => {
    console.log("Finding students with filters:", filters);
    // Fetch students based on selected filters
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">MARK ATTENDANCE</h2>

      {/* Attendance Date */}
      <div className="my-4">
        <label className="block font-semibold">Attendance Date: *</label>
        <input type="date" className="w-full p-2 border" />
      </div>

      {/* User Type Selection */}
      <div className="flex my-4 space-x-4">
        <label className="font-semibold">Find Users:</label>
        <input type="radio" name="userType" value="Students" checked /> Students
        <input type="radio" name="userType" value="Staff" /> Staff
      </div>

      {/* Filters Section */}
      <div className="p-4 border rounded-md shadow-md">
        <h3 className="font-bold">FIND STUDENTS FROM:</h3>

        <div className="grid grid-cols-2 gap-4 my-4">
          {["School", "Syllabus", "Branch", "Class", "Section", "Religion"].map((field) => (
            <div key={field}>
              <label className="block font-semibold">{field}:</label>
              <select name={field.toLowerCase()} onChange={handleFilterChange} className="w-full p-2 border">
                <option value="">Select</option>
                {/* Options should be dynamically populated */}
                <option value="Option1">Option 1</option>
              </select>
            </div>
          ))}
        </div>

        <button onClick={handleFindUsers} className="px-4 py-2 text-white bg-green-500 rounded">
          Find Users
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
