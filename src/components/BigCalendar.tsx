"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
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

  // Hide Sundays from the week/day views
  const hideSunday = (date: Date) => {
    if (date.getDay() === 0) {
      return { className: "hidden-sunday" };
    }
    return {};
  };

  const schoolStart = new Date(0, 0, 0, 9, 0);  // 9:00 AM
  const schoolEnd = new Date(0, 0, 0, 16, 0);   // 4:00 PM

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
        min={schoolStart}
        max={schoolEnd}
        dayPropGetter={hideSunday}
        defaultView={Views.WEEK}
        timeslots={2}
        step={30}
      />
    </div>
  );
};

export default BigCalendar;
