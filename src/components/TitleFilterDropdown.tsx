"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dropdownUI } from "../../types";

export default function TitleFilterDropdown({
  basePath,
}: {
  basePath: string;
}) {
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await fetch("/api/exams/titles");
        const data = await res.json();
        setTitles(data.titles || []);
      } catch (err) {
        console.error("Failed to fetch exam titles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  const handleChange = (title: string) => {
    const params = new URLSearchParams(searchParams);
    if (title) {
      params.set("title", title);
    } else {
      params.delete("title");
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  const selectedTitle = searchParams.get("title") || "";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative w-full md:w-auto">
        <select
          className={dropdownUI}
          onChange={(e) => handleChange(e.target.value)}
          disabled={loading}
          value={selectedTitle}
        >
          <option value="">Select Exam</option>
          {titles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
