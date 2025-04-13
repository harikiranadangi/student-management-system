"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TableSearch = () => {
  const router = useRouter();
  const [value, setValue] = useState(""); // tracks input field
  const [debouncedValue, setDebouncedValue] = useState(""); // delayed value

  // Whenever 'value' changes, we wait 300ms, then update 'debouncedValue'
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // 300 ms delay

    // Clear the timer if user types again within 300ms
    return () => clearTimeout(handler);
  }, [value]);

  // When debouncedValue changes, update the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }
    router.push(`${window.location.pathname}?${params}`);
  }, [debouncedValue]);

  return (
    <form className="width-full flex md:w-auto items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2" onSubmit={(e) => e.preventDefault()}>
      <Image src="/search.png" alt="Search" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
};

export default TableSearch;
