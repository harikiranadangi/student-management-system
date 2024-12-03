"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import InputField from "../InputField";
import { Dispatch, SetStateAction } from "react";



const TeacherForm = ({
    type,
    data,
    setOpen
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: data,
    });

    const onSubmit = handleSubmit((formData) => {
        console.log(formData);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new teacher</h1>
            <span className="text-xs font-medium text-gray-400">Authentication Information</span>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
                <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
                <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />
            </div>
            <span className="text-xs font-medium text-gray-400">Personal Information</span>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField label="First Name" name="firstName" defaultValue={data?.firstName} register={register} error={errors.firstName} />
                <InputField label="Last Name" name="lastName" defaultValue={data?.lastName} register={register} error={errors.lastName} />
                <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
                <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />

                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Blood Type</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("bloodType")}
                        defaultValue={data?.bloodType}
                    >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="Under Investigation">Under Investigation</option>
                    </select>
                    {errors.bloodType?.message && (
                        <p className="text-xs text-red-400">{errors.bloodType.message.toString()}</p>
                    )}
                </div>

                <InputField label="Birthday" name="dateOfBirth" defaultValue={data?.dateOfBirth} register={register} error={errors.dateOfBirth} type="date" />
            </div>

            <div className="flex flex-wrap gap-16">
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Gender</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gender")}
                        defaultValue={data?.gender}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors.gender?.message && (
                        <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col justify-center w-full gap-2 md:w-1/4">
                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" htmlFor="img">
                        <Image src="/upload.png" alt="Upload" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden" />
                    {errors.img?.message && (
                        <p className="text-xs text-red-400">{errors.img.message.toString()}</p>
                    )}
                </div>

            </div>

            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default TeacherForm;
