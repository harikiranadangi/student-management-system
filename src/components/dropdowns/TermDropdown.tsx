"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { dropdownUI } from "../../../types";
import { Term } from "@prisma/client";

export default function TermDropdown({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTerm = searchParams.get("term") || "";

  const terms = Object.values(Term).map((value) => ({
    value,
    label: value.replace("TERM_", "Term "),
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("term", term);
    else params.delete("term");

    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-auto">
      <select
        className={`${dropdownUI} dark:bg-gray-800 dark:text-white`}
        onChange={handleChange}
        value={selectedTerm}
      >
        <option value="">Select Term</option>
        {terms.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
