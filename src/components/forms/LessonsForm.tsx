"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonsSchema, LessonsSchema } from "@/lib/formValidationSchemas";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const router = useRouter();
  const { classes = [], teachers = [] } = relatedData || {};
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<LessonsSchema>({
    resolver: zodResolver(lessonsSchema),
    defaultValues: {
      ...data,
    },
  });

  const classIdWatch = watch("classId");

  // Fetch subjects when classId changes
  useEffect(() => {
    if (!classIdWatch) return;

    const fetchSubjects = async () => {
      try {
        const res = await fetch(`/api/classes/classSubjects?classId=${classIdWatch}`);
        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Failed to fetch subjects");

        setSubjects(result.subjects);
        setValue("subjectId", 0); // assuming your form accepts "" and the dropdown supports it
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchSubjects();
  }, [classIdWatch, setValue]);

  // For edit case, format time and reset form
  useEffect(() => {
    if (type === "update" && data) {
      const formatTime = (value: any) => {
        try {
          const date = new Date(value);
          return isNaN(date.getTime()) ? "" : date.toTimeString().slice(0, 5);
        } catch {
          return "";
        }
      };

      reset({
        ...data,
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
      });

      // preload subjects if classId exists
      if (data.classId) {
        setSelectedClassId(data.classId);
      }
    }
  }, [data, reset, type]);

  const onSubmit = async (formData: LessonsSchema) => {
    console.log("Submitting form with data:", formData); 
    try {
      const url = type === "create" ? "/api/lessons" : `/api/lessons/${formData?.id}`;
      const method = type === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Something went wrong");
      }

      toast.success(`Lesson ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
      reset();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to submit lesson.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update lesson"}
      </h1>

      <div className="flex flex-wrap gap-4">
        {/* Day */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("day")}
          >
            <option value="">Select Day</option>
            {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
              <option value={day} key={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day?.message && <p className="text-xs text-red-400">{errors.day.message}</p>}
        </div>

        {/* Start Time */}
        <InputField
          label="Start Time"
          name="startTime"
          register={register}
          error={errors.startTime}
          type="time"
        />

        {/* End Time */}
        <InputField
          label="End Time"
          name="endTime"
          register={register}
          error={errors.endTime}
          type="time"
        />

        {/* Class */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("classId", { valueAsNumber: true })}
          >
            <option value="">Select Class</option>
            {classes.map((cls: { id: number; name: string }) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>

        {/* Subject (depends on class) */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("subjectId", { valueAsNumber: true })}
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">{errors.subjectId.message}</p>
          )}
        </div>

        {/* Teacher */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("teacherId")}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher: { id: string; name: string }) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">{errors.teacherId.message}</p>
          )}
        </div>
      </div>

      <button className="self-start px-4 py-2 text-white bg-blue-500 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
