"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
    {
        id: 1,
        title: "Parent-Teacher Meeting",
        time: "2024-11-10T10:00:00",
        description: "Discuss student progress and address any concerns with teachers."
    },
    {
        id: 2,
        title: "Science Fair",
        time: "2024-11-15T09:00:00",
        description: "Annual science fair showcasing student projects and innovations."
    },
    {
        id: 3,
        title: "Annual Sports Day",
        time: "2024-11-20T08:00:00",
        description: "School-wide sports events and activities for all students."
    }
];


const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div className="p-4 bg-white rounded-md">
            <Calendar onChange={onChange} value={value} className="w-full react-calendar"/>
            <div className='flex items-center justify-between'>
                <h1 className="my-4 text-xl font-semibold">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className='flex flex-col gap-4'>
                {events.map(event=>(
                    <div className='p-5 border-2 border-t-4 border-gray-100 rounded-md odd:border-t-LamaSky even:border-t-lamaPurple' key={event.id}>
                        <div className='flex items-center justify-between'>
                            <h1 className="font-semibold text-gray-600">{event.title}</h1>
                            <span className="text-xs text-gray-300">{event.time}</span>
                        </div>   
                        <p className="mt-2 text-sm text-gray-400">{event.description}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventCalendar;
