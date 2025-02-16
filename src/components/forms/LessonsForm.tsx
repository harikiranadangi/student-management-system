"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { lessonsSchema, LessonsSchema, } from "@/lib/formValidationSchemas";
import { createLesson,  } from "@/lib/actions";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
    type,
    data,
    setOpen,
    relatedData
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LessonsSchema>({
        resolver: zodResolver(lessonsSchema),
    });

    // * AFTER REACT 19 IT'LL BE USE ACTIONSTATE

    // * Using useActionState with startTransition
    const [state, formAction] = React.useActionState(
        type === "create" ? createLesson : updateLesson, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        React.startTransition(() => {
            formAction(data); // Dispatching inside startTransition
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh()
        }
    }, [state.success]);

    const { subjects = [], classes = [], teachers = [] } = relatedData || {};

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new lesson" : "Update the lesson"}
            </h1>
            <div className="flex flex-wrap justify-between gap-4">
                {/* Lesson Name */}
                <InputField
                    label="Lesson Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
    
                {/* Day */}
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Day</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("day")}
                        defaultValue={data?.day || ""}
                    >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <option value={day} key={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                    {errors.day?.message && (
                        <p className="text-xs text-red-400">{errors.day.message.toString()}</p>
                    )}
                </div>
    
                {/* Start Time */}
                <InputField
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    defaultValue={data?.startTime}
                    register={register}
                    error={errors?.startTime}
                />
    
                {/* End Time */}
                <InputField
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    defaultValue={data?.endTime}
                    register={register}
                    error={errors?.endTime}
                />
    
                {/* Subject ID */}
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subjectId")}
                        defaultValue={data?.subjectId || ""}
                    >
                        {subjects.map((subject: { id: number; name: string }) => (
                            <option value={subject.id} key={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId?.message && (
                        <p className="text-xs text-red-400">{errors.subjectId.message.toString()}</p>
                    )}
                </div>
    
                {/* Class ID */}
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classId || ""}
                    >
                        {classes.map((classItem: { id: number; name: string }) => (
                            <option value={classItem.id} key={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>
                    )}
                </div>
    
                {/* Teacher ID */}
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Teacher</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teacherId")}
                        defaultValue={data?.teacherId || ""}
                    >
                        {teachers.map((teacher: { id: string; name: string }) => (
                            <option value={teacher.id} key={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                    {errors.teacherId?.message && (
                        <p className="text-xs text-red-400">{errors.teacherId.message.toString()}</p>
                    )}
                </div>
            </div>
            {state.error && <span className="text-red-500">Something went wrong!</span>}
            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
    
};

export default LessonForm;
