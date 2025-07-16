"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TitleFilterDropdown({ basePath }: { basePath: string }) {
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
    <select
      value={selectedTitle}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full py-2 pl-4 pr-10 text-sm text-gray-500 border border-gray-300 rounded-full appearance-none md:w-auto focus:ring-2 focus:ring-LamaSky focus:outline-none"
      disabled={loading}
    >
      <option value="">Select Exam</option>
      {titles.map((title) => (
        <option key={title} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
}
