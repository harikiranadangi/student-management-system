"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];




const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    const router = useRouter()

    useEffect(() => {

        if (value instanceof Date) {
            router.push(`?date=${value}`);
        }
    }, [value, router])

    return <Calendar onChange={onChange} value={value}/>;
};

export default EventCalendar;

const events = [
    {
        id: 1,
        title: "Parent-Teacher Meeting",
        time: "2025-03-07T10:00:00",
        description: "Discuss student progress and address any concerns with teachers."
    },
    {
        id: 2,
        title: "Science Fair",
        time: "2024-12-01T09:00:00",
        description: "Annual science fair showcasing student projects and innovations."
    },
    {
        id: 3,
        title: "Annual Sports Day",
        time: "2024-12-02T08:00:00",
        description: "School-wide sports events and activities for all students."
    }
];