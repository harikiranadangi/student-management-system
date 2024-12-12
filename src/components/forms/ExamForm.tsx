"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { examSchema, ExamSchema } from "@/lib/formValidationSchemas";
import { createExam, updateExam } from "@/lib/actions";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExamForm = ({
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
    const [state, setState] = useState<{ success: boolean; error: boolean }>({
        success: false,
        error: false,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ExamSchema>({
        resolver: zodResolver(examSchema),
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Depending on type, use create or update and pass currentState
            if (type === "create") {
                const result = await createExam(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateExam(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            }
            toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        } catch (error) {
            setState({ success: false, error: true });
            toast.error("Something went wrong!");
        }
    });

    const router = useRouter();
    
    useEffect(() => {
        if (state.success) {
            toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state.success, router, setOpen, type]);
    
    const { lessons } = relatedData || {};

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new exam" : "Update the exam"}
            </h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Exam Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                
                <InputField
                    label="Start Date"
                    name="startTime"
                    defaultValue={data?.startTime}
                    register={register}
                    error={errors?.startTime}
                    type="datetime-local"
                />
                
                <InputField
                    label="End Date"
                    name="endTime"
                    defaultValue={data?.endTime}
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
                />

                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}

                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Lesson</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("lessonId")}
                        defaultValue={data?.lessons || []} // Handle default value properly
                    >
                        {lessons?.map((lesson: { id: number; name: string; }) => (
                            <option value={lessons.id} key={lessons.id}>
                                {lessons.name}
                            </option>
                        ))}
                    </select>
                    {errors?.lessonId?.message && (
                        <p className="text-xs text-red-400">{errors.lessonId?.message}</p>
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

export default ExamForm;
