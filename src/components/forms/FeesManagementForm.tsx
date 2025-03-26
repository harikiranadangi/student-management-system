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

    const [selectedGrade, setSelectedGrade] = useState<number | null>(data?.gradeId || null);

    const [state, setState] = useState<{ success: boolean; error: boolean }>({
        success: false,
        error: false,
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FeesSchema>({
        resolver: zodResolver(feesSchema),
        defaultValues: data || {}
    });

    const router = useRouter();

    useEffect(() => {
        const total = watch("totalFees") || 0;
        const abacus = watch("abacusFees") || 0;
        const calculatedTermFees = Math.round((total - abacus) / 4);
        setValue("termFees", calculatedTermFees);
    }, [watch("totalFees"), watch("abacusFees"), setValue]);


    useEffect(() => {
        if (state.success) {
            toast(`Fees has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state.success, setOpen, router]);

    const onSubmit = handleSubmit(async (data) => {
        console.log("Form submitted with data:", data); // Debugging

        try {
            const calculatedTerm = String(Math.round((data.totalFees - (data.abacusFees || 0)) / 4));



            const newData = {
                ...data,
                term: calculatedTerm // Assign Calculated Term 
            };

            if (type === "create") {
                const result = await createFees(state, newData);
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateFees(state, { id: data.id, ...newData });
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




    const { classes = [], grades = [] } = relatedData || {};

    // Filter classes based on selected grade
    const filteredClasses = selectedGrade
        ? classes.filter((cls: { id: number; gradeId: number }) => cls.gradeId === selectedGrade)
        : [];


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a Fees" : "Update Fees"}
            </h1>


            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    {/* Academic Year Selection Dropdown */}
                    <label className="text-sm font-medium text-gray-500">Academic Year</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("academicYear")}
                        defaultValue={data?.academicYear}
                    >
                        <option value="">Select Academic Year</option>
                        {["2024-25", "2025-26"].map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    {errors?.academicYear && <p className="text-xs text-red-400">{errors.academicYear.message}</p>}

                    {/* Term Fees Input */}
                    <label className="text-sm font-medium text-gray-500">Total Fees</label>
                    <input
                        type="number"
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("totalFees", { valueAsNumber: true, required: true })}
                        defaultValue={data?.totalFees}
                    />
                    {errors?.totalFees && <p className="text-xs text-red-400">{errors.totalFees.message}</p>}

                    <InputField
                        label="Abacus Fees"
                        name="abacusFees"  // ✅ Ensure this matches schema
                        defaultValue={data?.abacusFees}
                        register={register}
                        error={errors?.abacusFees}
                    />


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


                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Start Date</label>
                        <input
                            type="date"
                            {...register("startDate", { required: "Start Date is required!" })}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors?.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Due Date</label>
                        <input
                            type="date"
                            {...register("dueDate", { required: "Due Date is required!" })}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={data?.dueDate}
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

