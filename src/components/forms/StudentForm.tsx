"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import React, { Dispatch, SetStateAction, startTransition, useEffect, useState } from "react";
import { studentschema, Studentschema } from "@/lib/formValidationSchemas";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';


const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>
  relatedData?: any;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Studentschema>({
    resolver: zodResolver(studentschema),
    defaultValues: data || {},
  });

  useEffect(() => {
    reset(data); // Reset form when data changes
  }, [data, reset]);

  // * AFTER REACT 19 IT'LL BE USE ACTIONSTATE

  const [img, setImg] = useState<any>()

  // // Using useActionState with startTransition
  // const [state, formAction] = React.useActionState(
  //   type === "create" ? createStudent : updateStudent,
  //   {
  //     success: false,
  //     error: false,
  //   }
  // );

  const [state, setState] = useState<{ success: boolean; error: string | null }>({
    success: false,
    error: null,
  });
  
  const formAction = async (currentState: any, data: any) => {
    console.log("Payload being sent to", type === "update" ? "updateStudent" : "createStudent", data);
  
    try {
      const response = type === "update"
        ? await updateStudent(currentState, data)  // ✅ Use updateStudent for updates
        : await createStudent(currentState, data);
  
      console.log("Response from server:", response);
  
      setState({
        success: response.success,
        error: response.error ? String(response.error) : null,
      });
    } catch (error) {
      console.error("Form Submission Error:", error);
      setState({ success: false, error: String(error) });
    }
  };
    
  
  const onSubmit = handleSubmit((data) => {
    console.log("Form Data Captured:", data);
    startTransition(() => {
      const payload = { ...data, img: img?.secure_url };
      console.log("Payload Sent to formAction:", payload);
      formAction(state, payload);
    });
  });
  




  // const onSubmit = handleSubmit((data) => {
  //   console.log("Form Data Captured:", data);
  //   startTransition(() => {
  //     const payload = { ...data, img: img?.secure_url };
  //     console.log("Payload Sent to formAction:", payload);
  //     formAction(payload);
  //   });
  // });



  const router = useRouter()

  useEffect(() => {
    console.log("Current Form State:", state);
    
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success]);
  
  useEffect(() => {
    if (state.error) {
      console.error("Form submission error:", state.error);
      toast.error(state.error);  // ✅ Show error message in UI
    }
  }, [state.error]);
  


  const { grades, classes } = relatedData;

  console.log("Payload being sent to createStudent:", data);


  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>

      <span className="text-xs font-medium text-gray-400">Authentication Information</span>

      <div className="flex flex-wrap justify-between gap-4">

        <InputField

          label="Username"
          name="username"
          register={register}
          error={errors?.username}
        />

        <InputField

          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}

        />

        <InputField
          label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />

      </div>

      <span className="text-xs font-medium text-gray-400">Personal Information</span>

      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          console.log("Image Uploaded:", result.info); // Debug log
          widget.close();
        }}
      >

        {({ open }) => {
          return (
            <div
              className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" onClick={() => open()}>
              <Image src="/upload.png" alt="" width={28} height={28} />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>

      <div className="flex flex-wrap justify-between gap-4">

        <InputField label="Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />

        <InputField label="Surname" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />

        <InputField label="Parent Name" name="parentName" defaultValue={data?.parentName} register={register} error={errors.parentName} />

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

        <InputField
          label="Birthday"
          name="dob"
          defaultValue={data?.dob ? new Date(data.dob).toISOString().split("T")[0] : ""}
          register={register}
          error={errors.dob}
          type="date"
        />


        {data && (<InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
        />
        )}

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

        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-500">{errors.gradeId.message.toString()}</p>
          )}
        </div>

        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select

            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map((classItem: { id: number; name: string; capacity: number; _count: { students: number } }) => (
              <option value={classItem.id} key={classItem.id}>
                ({classItem.name}
                {/* - {classItem._count.students + "/" + classItem.capacity}{" "} Capacity) */})
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-500">{errors.classId.message.toString()}</p>
          )}
        </div>



      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="p-2 text-white bg-blue-400 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
