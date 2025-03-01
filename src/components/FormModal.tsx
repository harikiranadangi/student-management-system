"use client";

import { deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher, } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  lesson: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
  fees: deleteSubject,
  homeworks: deleteSubject,
}

// Dynamically import the form components
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonsForm = dynamic(() => import("./forms/LessonsForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Define the available forms based on the table type
const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;

} = {

  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),

  class: (setOpen, type, data, relatedData) => (
    <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),

  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  
  student: (setOpen, type, data, relatedData) => (
    <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),

  exam: (setOpen, type, data, relatedData) => (
    <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),

  lesson: (setOpen, type, data, relatedData) => (
    <LessonsForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-LamaYellow"
      : type === "update"
        ? "bg-LamaSky"
        : "bg-LamaPurple";

  const [open, setOpen] = useState(false);

  // Define the form to render based on the type and table
  const Form = () => {

    // Using useActionState with startTransition
    const [state, formAction] = React.useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh()
      }
    }, [state]);

    return type === "delete" && id ? (
      <form action={formAction} className="flex flex-col gap-4 p-4">
        <input
          type="text | number" name="id" value={id || ""} // Use the id value or an empty string if undefined
          readOnly
        />

        <span className="font-medium text-center">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="self-center px-4 py-2 text-white bg-red-700 border-none rounded-md w-max">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-60">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute cursor-pointer top-4 right-4"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
