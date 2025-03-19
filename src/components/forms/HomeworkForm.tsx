"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createHomework, updateHomework } from "@/lib/actions"; // Import your API function
import { homeworkSchema, HomeworkSchema } from "@/lib/formValidationSchemas";

const HomeworkForm = ({
    type,
    data,
    setOpen,
    relatedData
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {

    const [selectedGrade, setSelectedGrade] = useState<number | null>(data?.gradeId || null);
    
    const [state, setState] = useState<{ success: boolean; error: boolean }>({
        success: false,
        error: false,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<HomeworkSchema>({
        resolver: zodResolver(homeworkSchema),
        defaultValues: data || {}
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Homework has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state.success, setOpen, router]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Depending on type, use create or update and pass currentState
            if (type === "create") {
                const result = await createHomework(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateHomework(state, { id: data.id, ...data }); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            }
            toast(`Homework has been ${type === "create" ? "created" : "updated"}!`);

            setOpen(false);
            router.refresh();
        } catch (error) {
            setState({ success: false, error: true });
            toast.error("Something went wrong!");
        }
    });

    const { classes = [], grades = [] } = relatedData || {};

    // Filter classes based on selected grade
    const filteredClasses = selectedGrade
        ? classes.filter((cls: { id: number; gradeId: number }) => cls.gradeId === selectedGrade)
        : [];


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a Homework" : "Update Homework"}
            </h1>

            {/* <span className="text-lg font-medium text-gray-400">Homework Details</span> */}
            {/* <span className="text-xs font-medium text-gray-400">Class & Subject</span> */}

            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-sm font-medium text-gray-500">Grade</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeId", { valueAsNumber: true, required: "Grade ID is required!" })}
                    >
                        <option value="">Select Grade</option>
                        {(grades || []).map((grd: { id: number; level: string }) => (
                            <option key={grd.id} value={grd.id}>{grd.level}</option> // ✅ Ensures value is a number
                        ))}
                    </select>

                    {errors?.gradeId && <p className="text-xs text-red-400">{errors.gradeId.message}</p>}

                    <label className="text-sm font-medium text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId", { valueAsNumber: true, required: "Class ID is required!" })}
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls: { id: number; name: string }) => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option> // ✅ Ensures value is a number
                        ))}
                    </select>

                    {errors?.classId && <p className="text-xs text-red-400">{errors.classId.message}</p>}

                    <div className="flex flex-wrap justify-between w-full gap-4">
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <textarea
                                {...register("description")}
                                defaultValue={data?.description} // ✅ Pre-fill existing data
                                className=" min-w-[700px] h-64 p-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter homework details..."
                            ></textarea>

                            {errors?.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Date</label>
                        <input
                            type="date"
                            {...register("date", { required: "Date is required!" })}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors?.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                    </div> */}

                </div>

            </div>

            {state.error && <span className="text-red-500">Something went wrong!</span>}

            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );

};

export default HomeworkForm;

