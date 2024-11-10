"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long!' })
    .max(20, { message: 'Username must be at most 20 characters long!' }),
    email: z.string().email({message:"Invalid email address!"}),
    password: z
    .string()
    .min(8,{message:"Password must be at least 8 characters long!"}),
    firstName: z.string().min(1,{message:"First Name is Required!"}),
    lastName: z.string().min(1,{message:"Last Name is Required!"}),
    gender: z.enum(["Male", "Female"], {message: "Gender is Required!"}),
    phone: z.string().min(1,{message:"First Name is Required!"}).optional(),
    address: z.string().min(1,{message:"Address is Required!"}),
    dateOfBirth: z.date({message:"Date of Birth is Required!"}),
    img:z.instanceof(File, {message:"Image is not required"}).optional()
});

const TeacherForm = ({
    type,
    data,
}:{
    type:"create" | "update"; 
    data?: any;
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });

      const onSubmit = handleSubmit(data=>{
        console.log(data);
      })

      return <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">Create a New Teacher</h1>
        <span className="text-xs font-medium text-gray-400">Authentication Information</span>
        <span className="text-xs font-medium text-gray-400">Personal Information</span>
        <button className="p-2 text-white bg-blue-400 rounded-md">{type==="create" ? "Create" : "Update"}</button>
</form>
};




export default TeacherForm;