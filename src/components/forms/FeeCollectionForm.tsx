"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { feecollectionSchema, FeeCollectionSchema } from "@/lib/formValidationSchemas";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createFeesCollect, updateFeesCollect } from "@/lib/actions"; // Import your API function

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
    const [img, setImg] = useState<string | null>(data?.img || null);
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
        defaultValues: data || {}, // Populate form with existing data
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Admin has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state.success, setOpen, router]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Depending on type, use create or update and pass currentState
            if (type === "create") {
                const result = await createFeesCollect(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateFeesCollect(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            }
            toast(`Admin has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        } catch (error) {
            setState({ success: false, error: true });
            toast.error("Something went wrong!");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={(onSubmit)}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new Admin" : "Update the Admin"}
            </h1>

            <span className="text-xs font-medium text-gray-400">Fee Information</span>

            <div className="flex flex-wrap justify-between gap-4">
                <InputField label="Fb Number" name="receiptNo" register={register} error={errors?.receiptNo} />
                <InputField label="Amount" name="amountPaid"  register={register} error={errors?.amountPaid} />
                <InputField label="Discount" name="discountGiven"  register={register} error={errors?.discountGiven} />
                <InputField label="Fine" name="fineCollected"  register={register} error={errors?.fineCollected} />
                <InputField label="Payment Date" name="dob" type="date" register={register} error={errors?.paymentDate} />
            </div>

            {state.error && <span className="text-red-500">Something went wrong!</span>}

            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default FeeCollectionForm;
