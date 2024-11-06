"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div className="w-full max-w-lg p-4 bg-white rounded-md">
            <Calendar 
                onChange={onChange} 
                value={value} 
                className="w-full react-calendar"
            />
        </div>
    );
};

export default EventCalendar;
