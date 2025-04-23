"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import React, { Dispatch, SetStateAction, startTransition, useEffect, useState } from "react";
import { studentschema, Studentschema } from "@/lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Studentschema>({
    resolver: zodResolver(studentschema),
    defaultValues: data || {},
  });

  const { grades, classes } = relatedData;
  const [img, setImg] = useState<any>();
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(data?.gradeId || null);
  const [filteredClasses, setFilteredClasses] = useState(
    data?.gradeId ? classes.filter((cls: any) => cls.gradeId === data.gradeId) : []
  );

  const [state, setState] = useState<{ success: boolean; error: string | null }>({
    success: false,
    error: null,
  });

  const router = useRouter();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  useEffect(() => {
    if (selectedGradeId !== null) {
      const related = classes.filter((cls: any) => cls.gradeId === selectedGradeId);
      setFilteredClasses(related);
    } else {
      setFilteredClasses([]);
    }
  }, [selectedGradeId, classes]);

  const onSubmit = handleSubmit((data) => {
    console.log("Form Data Captured:", data);
    startTransition(() => {
      formAction(data);
    });
  });

  const formAction = async (data: any) => {
    const payload = { ...data, img: img?.secure_url };

    const apiUrl = type === "update"
      ? `/api/users/students/${data.id}`
      : `/api/users/students`;

    try {
      const response = await fetch(apiUrl, {
        method: type === "update" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error in API request');
      }

      const result = await response.json();
      console.log("Response from server:", result);

      setState({ success: true, error: null });
    } catch (error: any) {
      console.error("Form Submission Error:", error);
      setState({ success: false, error: String(error) });
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>

      {/* Authentication */}
      <span className="text-xs font-medium text-gray-400">Authentication Information</span>
      <div className="flex flex-wrap justify-between gap-4">
        <InputField label="Username" name="username" register={register} error={errors?.username} />
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />
      </div>

      {/* Personal Info */}
      <span className="text-xs font-medium text-gray-400">Personal Information</span>
      <div className="flex flex-wrap justify-between gap-4">
        <InputField label="Admission No" name="id" defaultValue={data?.id} register={register} error={errors.id} />
        <InputField label="Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
        <InputField label="Surname" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />
        <InputField label="Parent Name" name="parentName" defaultValue={data?.parentName} register={register} error={errors.parentName} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />

        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Academic Year</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("academicYear")} defaultValue={data?.academicYear}>
            <option value="Y2024_2025">2024-25</option>
            <option value="Y2025_2026">2025-26</option>
          </select>
          {errors.academicYear?.message && <p className="text-xs text-red-400">{errors.academicYear.message.toString()}</p>}
        </div>

        <InputField label="Birthday" name="dob" defaultValue={data?.dob ? new Date(data.dob).toISOString().split("T")[0] : ""} register={register} error={errors.dob} type="date" />
      </div>

      <div className="flex flex-wrap gap-16">
        {/* Gender */}
        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")} defaultValue={data?.gender}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender?.message && <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>}
        </div>

        {/* Grade with change handler */}
        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
            onChange={(e) => setSelectedGradeId(parseInt(e.target.value))}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>{grade.level}</option>
            ))}
          </select>
          {errors.gradeId?.message && <p className="text-xs text-red-500">{errors.gradeId.message.toString()}</p>}
        </div>

        {/* Filtered classes */}
        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {filteredClasses.map((cls: { id: number; name: string }) => (
              <option value={cls.id} key={cls.id}>{cls.name}</option>
            ))}
          </select>
          {errors.classId?.message && <p className="text-xs text-red-500">{errors.classId.message.toString()}</p>}
        </div>

        {/* Image Upload */}
        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            console.log("Image Uploaded:", result.info);
            widget.close();
          }}
        >
          {({ open }) => (
            <div className="flex items-right gap-2 text-xs text-gray-500 cursor-pointer" onClick={() => open()}>
              <Image src="/upload.png" alt="" width={28} height={28} />
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

export default StudentForm;
