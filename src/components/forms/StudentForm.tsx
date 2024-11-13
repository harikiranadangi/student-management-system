"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import Image from "next/image";
import InputField from "../InputField";

// Define the schema with zod
const schema = z.object({
  username: z.string().length(10, { message: 'Invalid Username!' }),
  email: z.string().optional(),
  password: z.string().min(5, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First Name is required!" }),
  surName: z.string().optional(),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!"}),
  phone: z.string().length(10, { message: 'Invalid Mobile Number!' }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Don't Know"], { message: "Please select a valid blood type!" }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date of Birth is required!" }),
  img: z.any().optional(),
});

// Infer the form data type from schema
type Inputs = z.infer<typeof schema>;

const StudentForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  // Watch the username field
  const username = watch("username");

  // Update the password to match the username
  useEffect(() => {
    if (username) {
      setValue("password", username);
    }
  }, [username, setValue]);

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new student</h1>
      <span className="text-xs font-medium text-gray-400">Authentication Information</span>
      <div className="flex flex-wrap justify-between gap-4">
        <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />
      </div>
      <span className="text-xs font-medium text-gray-400">Personal Information</span>
      <div className="flex flex-wrap justify-between gap-4">
        <InputField label="First Name" name="firstName" defaultValue={data?.firstName} register={register} error={errors.firstName} />
        <InputField label="Surname" name="surName" defaultValue={data?.surName} register={register} error={errors.surName} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />
        
        <div className="flex flex-col w-full gap-2 md:w-1/4">
          <label className="text-xs text-gray-500">Blood Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("bloodType")}
            defaultValue={data?.bloodType}
          >
            <option value="">-Select-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Under Investigation">Don't Know</option>
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
              defaultValue=""
          >
              <option value="" disabled>-Select-</option> {/* Default "Select" option */}
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

export default StudentForm;
