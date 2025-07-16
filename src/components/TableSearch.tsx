"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const TableSearch = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null); // Reference to input
  const [value, setValue] = useState(""); // tracks input field
  const [debouncedValue, setDebouncedValue] = useState(""); // delayed value

  // Whenever 'value' changes, we wait 500ms, then update 'debouncedValue'
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // 500 ms delay

    // Clear the timer if the user types again within the delay
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

  // Keyboard shortcut (Ctrl+K or Cmd+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault(); // Prevent default behavior (browser search)
        inputRef.current?.focus(); // Focus the input field
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <form
      className="flex items-center pl-4 gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <Image src="/search.png" alt="Search" width={14} height={14} />
      <input
        ref={inputRef} // Assign ref to input
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
