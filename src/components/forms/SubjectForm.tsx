"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
    } = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Depending on type, use create or update and pass currentState
            if (type === "create") {
                const result = await createSubject(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateSubject(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            }
            toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
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
            toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    const { teachers } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new subject" : "Update the subject"}
            </h1>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Subject Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
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
                    <label className="text-xs text-gray-500">Teachers</label>
                    <select
                        multiple
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teachers")}
                        defaultValue={data?.teachers || []} // Handle default value properly
                    >
                        {teachers?.map((teacher: { id: string; name: string; surname: string }) => (
                            <option value={teacher.id} key={teacher.id}>
                                {teacher.name + " " + teacher.surname}
                            </option>
                        ))}
                    </select>
                    {errors?.teachers && (
                        <p className="text-xs text-red-400">{errors.teachers?.message}</p>
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

export default SubjectForm;
