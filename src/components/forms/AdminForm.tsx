"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { AdminSchema, adminSchema } from "@/lib/formValidationSchemas";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { createAdmin, updateAdmin } from "@/lib/actions"; // Import your API function

const AdminForm = ({
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
    } = useForm<AdminSchema>({
        resolver: zodResolver(adminSchema),
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
                const result = await createAdmin(state, data); // Pass current state and form data
                setState({ success: result.success, error: result.error });
            } else {
                const result = await updateAdmin(state, data); // Pass current state and form data
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

            <span className="text-xs font-medium text-gray-400">Authentication Information</span>

            <div className="flex flex-wrap justify-between gap-4">
                <InputField label="Username" name="username" register={register} error={errors?.username} />
                <InputField label="Email" name="email" register={register} error={errors?.email} />
                <InputField label="Password" name="password" type="password" register={register} error={errors?.password} />
            </div>

            <span className="text-xs font-medium text-gray-400">Personal Information</span>

            <div className="flex flex-wrap justify-between gap-4">
                <InputField label="Full Name" name="full_name" register={register} error={errors?.full_name} />
                <InputField label="Parent Name" name="parentName" register={register} error={errors?.parentName} />
                <InputField label="Phone" name="phone" register={register} error={errors?.phone} />
                <InputField label="Address" name="address" register={register} error={errors?.address} />

                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Blood Type</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("bloodType")}>
                        <option value="" disabled>Select Blood Type</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors?.bloodType?.message && <p className="text-xs text-red-400">{errors.bloodType.message}</p>}
                </div>

                <InputField label="Birthday" name="dob" type="date" register={register} error={errors?.dob} />
            </div>

            <div className="flex flex-wrap gap-16">
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Gender</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")}>
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors?.gender?.message && <p className="text-xs text-red-400">{errors.gender.message}</p>}
                </div>

                <CldUploadWidget uploadPreset="school" onSuccess={(result, { widget }) => {
                    if (result.info && typeof result.info !== "string" && "secure_url" in result.info) {
                        setImg(result.info.secure_url);
                    } else {
                        console.error("Upload failed or returned unexpected data format.");
                    }
                    widget.close();
                }}>

                    {({ open }) => (
                        <div className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" onClick={() => open()}>
                            <Image src="/upload.png" alt="Upload" width={28} height={28} />
                            <span>Upload a photo</span>
                        </div>
                    )}
                </CldUploadWidget>
            </div>

            {state.error && <span className="text-red-500">Something went wrong!</span>}

            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default AdminForm;
