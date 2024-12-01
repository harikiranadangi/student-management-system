"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject } from "@/lib/actions";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
    type,
    data,
    setOpen
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
    } = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
    });

    // * AFTER REACT 19 IT'LL BE USE ACTIONSTATE

    // Using useActionState with startTransition
    const [state, formAction] = React.useActionState(createSubject, {
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
            toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh()
        }
    }, [state.success]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new subject" : "Update the new subject"}
            </h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Subject Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
            </div>
            {state.error && <span className="text-red-500">Something went wrong!</span>}
            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default SubjectForm;
