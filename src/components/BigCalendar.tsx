"use client";

import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

type CalendarEvent = {
  start: Date;
  end: Date;
  title: string;
};

const BigCalendar = ({ data }: { data: CalendarEvent[] }) => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  // Hide Sundays
  const hideSunday = (date: Date) => {
    if (date.getDay() === 0) {
      return { className: "hidden-sunday" };
    }
    return {};
  };

  const today = new Date();
  const schoolStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    9,
    0
  );
  const schoolEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    16,
    10
  );

  // Style Breaks & Lunch differently
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3174ad"; // default blue
    if (event.title.includes("Break")) backgroundColor = "#f59e0b"; // amber
    if (event.title.includes("Lunch")) backgroundColor = "#10b981"; // green
    return { style: { backgroundColor, borderRadius: "8px", color: "white" } };
  };

  return (
    <div className="custom-calendar" style={{ height: "80vh", width: "100%" }}>
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        view={view}
        views={["week", "day"]}
        onView={handleOnChangeView}
        defaultView={Views.WEEK}
        min={schoolStart}
        max={schoolEnd}
        dayPropGetter={hideSunday}
        step={10}       // 10 min increments
        timeslots={3}   // 3 slots per half-hour
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default BigCalendar;
