"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createFees, updateFees } from "@/lib/actions"; // Import your API function
import { feesSchema, FeesSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";

const FeesManagementForm = ({
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


    const [state, setState] = useState<{ success: boolean; error: boolean }>({
        success: false,
        error: false,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FeesSchema>({
        resolver: zodResolver(feesSchema),
        defaultValues: data || {}
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Fees has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state.success, setOpen, router]);

    useEffect(() => {
        console.log("Form Data:", data);
        console.log("Start Date from API:", data?.startDate);
        console.log("Due Date from API:", data?.dueDate);
    }, [data]);
    

    const onSubmit = handleSubmit(async (data) => {
        console.log("Form submitted with data:", data); // Debugging

        try {

            if (type === "create") {
                const result = await createFees(state, data);
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateFees(state, { id: data.id, ...data });
                setState({ success: result.success, error: result.error });
            }

            toast(`Fees has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error); // Debugging
            setState({ success: false, error: true });
            toast.error("Something went wrong!");
        }
    });

    const { grades = [] } = relatedData || {};


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a Fees" : "Update Fees"}
            </h1>

            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    {/* Academic Year Selection Dropdown */}

                    {/* Term Input */}
                    <label className="text-sm font-medium text-gray-500">Academic Year</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("academicYear", { required: "Term is required" })}
                        defaultValue={data?.academicYear}
                    >
                        <option value="">Academic Year</option>
                        <option value="Y2024_2025">2024-25</option>
                        <option value="Y2024_2025">2025-26</option>
                    </select>
                    {errors.academicYear && <p className="text-xs text-red-400">{errors.academicYear.message}</p>}

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

                    {/* Term Input */}
                    <label className="text-sm font-medium text-gray-500">Term</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("term", { required: "Term is required" })}
                        defaultValue={data?.term || ""}
                    >
                        <option value="">Select Term</option>
                        <option value="TERM_1">Term 1</option>
                        <option value="TERM_2">Term 2</option>
                        <option value="TERM_3">Term 3</option>
                        <option value="TERM_4">Term 4</option>
                    </select>
                    {errors.term && <p className="text-xs text-red-400">{errors.term.message}</p>}

                    {/* Term Fees Input */}
                    <label className="text-sm font-medium text-gray-500">Term Fees</label>
                    <input
                        type="number"
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("termFees", { valueAsNumber: true, required: true })}
                        defaultValue={data?.totalFees}
                    />
                    {errors?.termFees && <p className="text-xs text-red-400">{errors.termFees.message}</p>}

                    {/* Abacus Input */}
                    <InputField
                        label="Abacus Fees"
                        name="abacusFees"
                        defaultValue={data?.abacusFees}
                        register={register}
                        error={errors?.abacusFees}
                    />

                    {/* Start Date Input */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Start Date</label>
                        <input
                            type="date"
                            {...register("startDate")}
                            defaultValue={data?.startDate ? new Date(data.startDate).toISOString().split("T")[0] : ""}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />

                        {errors?.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
                    </div>

                    {/* Due Date Input */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Due Date</label>
                        <input
                            type="date"
                            {...register("dueDate")}
                            defaultValue={data?.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : ""}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors?.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
                    </div>

                </div>

            </div>

            {state.error && <span className="text-red-500">Something went wrong!</span>}

            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );

};

export default FeesManagementForm;

