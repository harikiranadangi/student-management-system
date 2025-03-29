"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createFeeCollect } from "@/lib/actions"; // Import your API function
import { feecollectionSchema, FeeCollectionSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";

const FeeCollectionForm = ({
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
    } = useForm<FeeCollectionSchema>({
        resolver: zodResolver(feecollectionSchema),
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
        console.log("Debugging relatedData:", relatedData);
        console.log("Fee Structure:", relatedData?.feeStructure);
    }, [data,relatedData]);


    const onSubmit = handleSubmit(async (data) => {
        console.log("Form submitted with data:", data); // Debugging

        try {

            if (type === "create") {
                const result = await createFeeCollect(state, data);
                setState({ success: result.success, error: result.error });
            }
            // else {
            //     const result = await updateFeeCollect(state, { id: data.id, ...data });
            //     setState({ success: result.success, error: result.error });
            // }

            toast(`Fees has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error); // Debugging
            setState({ success: false, error: true });
            toast.error("Something went wrong!");
        }
    });

    const { students = [], feeStructure = []} = relatedData || {};


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Collect a Fees" : "Update Fees"}
            </h1>

            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col w-full gap-2 md:w-1/4">

                    {/* Select Studetn From Dropdown */}
                    <label className="text-sm font-medium text-gray-500">Student Name</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("studentId", {
                            required: "Student ID is required!",
                            setValueAs: (v) => (v === "" ? undefined : v) // No need to convert to number
                        })}
                    >
                        <option value="">Select Student</option>
                        {(students || []).map((std: { studentId: string; name: string }) => (
                            <option key={std.studentId} value={std.studentId}>
                                {std.name}
                            </option>
                        ))}
                    </select>

                    {errors?.studentId && <p className="text-xs text-red-400">{errors.studentId.message}</p>}

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

                    {/* Paid Amount Input */}
                    <InputField
                        label="Paid Amount"
                        name="paidAmount"
                        defaultValue={data?.paidAmount}
                        register={register}
                        error={errors?.paidAmount}
                    />

                    {/* Paid Amount Input */}
                    <InputField
                        label="Abacus"
                        name="abacusPaidAmount"
                        defaultValue={data?.abacusPaidAmount}
                        register={register}
                        error={errors?.abacusPaidAmount}
                    />

                    {/* Discount Amount Input */}
                    <InputField
                        label="Discount"
                        name="discountAmount"
                        defaultValue={data?.discountAmount}
                        register={register}
                        error={errors?.discountAmount}
                    />



                    {/* Fine Amount Input */}
                    <InputField
                        label="Fine"
                        name="fineAmount"
                        defaultValue={data?.fineAmount}
                        register={register}
                        error={errors?.fineAmount}
                    />

                    {/* Start Date Input */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Received Date</label>
                        <input
                            type="date"
                            {...register("receivedDate")}
                            defaultValue={data?.receivedDate ? new Date(data.receivedDate).toISOString().split("T")[0] : ""}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />

                        {errors?.receivedDate && <p className="text-xs text-red-500">{errors.receivedDate.message}</p>}
                    </div>

                    {/* Start Date Input */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium text-gray-500">Receipt Date</label>
                        <input
                            type="date"
                            {...register("receiptDate")}
                            defaultValue={data?.receiptDate ? new Date(data.receiptDate).toISOString().split("T")[0] : ""}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors?.receiptDate && <p className="text-xs text-red-500">{errors.receiptDate.message}</p>}
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

export default FeeCollectionForm;

