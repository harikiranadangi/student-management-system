"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import clsx from "clsx";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value.toISOString()}`);
    }
  }, [value, router]);

  return (
    <div className="rounded-md p-2 bg-white dark:bg-gray-900">
      <Calendar
        onChange={onChange}
        value={value}
        locale="en-GB"
        className={clsx(
          "text-black", // keep text black
          "border-none", // remove default border
          "dark:bg-gray-900 dark:text-white" // dark background but text black
        )}
      />
    </div>
  );
};

export default EventCalendar;