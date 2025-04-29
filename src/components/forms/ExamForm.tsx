"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { examSchema, ExamSchema } from "@/lib/formValidationSchemas";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExamForm = ({
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
    const router = useRouter();
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
    const [examsForDate, setExamsForDate] = useState([]);
    const [existingTitles, setExistingTitles] = useState<string[]>([]);


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<ExamSchema>({
        resolver: zodResolver(examSchema),
        defaultValues: {
            ...data,
        },
    });

    useEffect(() => {
        if (selectedGradeId) {
            const fetchSubjects = async () => {
                try {
                    const res = await fetch(`/api/subjects/grade/${selectedGradeId}`);
                    const data = await res.json();
                    if (data.subjects) {
                        setFilteredSubjects(data.subjects);
                    } else {
                        toast.error("No subjects found for this grade.");
                    }
                } catch (error) {
                    toast.error("Failed to fetch subjects.");
                }
            };
            fetchSubjects();
        } else {
            setFilteredSubjects([]);
        }
    }, [selectedGradeId]);

    const selectedDate = watch("examDate");

    useEffect(() => {
        if (!selectedDate) return;

        const fetchExamsForDate = async () => {
            try {
                const res = await fetch("/api/exams/by-date", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ date: selectedDate }),
                });

                const data = await res.json();
                if (res.ok && data.exams) {
                    setExamsForDate(data.exams);
                } else {
                    setExamsForDate([]);
                    toast.error("No exams found for this date.");
                }
            } catch (err) {
                toast.error("Failed to fetch exams.");
            }
        };

        fetchExamsForDate();
    }, [selectedDate]);

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const res = await fetch("/api/exams/titles");
                const data = await res.json();
                if (data.titles) setExistingTitles(data.titles);
            } catch {
                toast.error("Failed to fetch exam titles.");
            }
        };
        fetchTitles();
    }, []);



    const onSubmit = async (formData: ExamSchema) => {
        try {
            const res = await fetch(
                type === "create" ? "/api/exams" : `/api/exams/${formData.id}`,
                {
                    method: type === "create" ? "POST" : "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) throw new Error("Something went wrong");

            toast.success(`Exam ${type === "create" ? "created" : "updated"} successfully!`);
            setOpen(false);
            router.refresh();
            reset();
        } catch (error) {
            toast.error("Failed to submit exam.");
        }
    };



    const { grades } = relatedData || {};

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new exam" : "Update the exam"}
            </h1>

            <div className="flex flex-col w-full gap-2 md:w-1/4">
                <label className="text-xs text-gray-500">Exam Title</label>
                <input
                    list="exam-titles"
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("title")}
                    defaultValue={data?.title || ""}
                    placeholder="Type or select a title"
                />
                <datalist id="exam-titles">
                    {existingTitles.map((title) => (
                        <option key={title} value={title} />
                    ))}
                </datalist>
                {errors.title?.message && (
                    <p className="text-xs text-red-400">{errors.title.message.toString()}</p>
                )}
            </div>



            <div className="flex flex-wrap justify-between gap-4">


                {/* Exam Date */}
                <InputField
                    label="Exam Date"
                    name="examDate"
                    defaultValue={data?.examDate}
                    register={register}
                    error={errors?.examDate}
                    type="date"
                />

                {/* Start Time */}
                <InputField
                    label="Start Time"
                    name="startTime"
                    defaultValue={data?.startTime}
                    register={register}
                    error={errors?.startTime}
                    type="time"
                />

                {/* Grade */}
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeId")}
                        defaultValue={data?.gradeId || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedGradeId(value ? parseInt(value) : null);
                        }}
                    >
                        <option value="">Select Grade</option>
                        {grades?.map((grade: { id: number; level: string }) => (
                            <option value={grade.id} key={grade.id}>
                                {grade.level}
                            </option>
                        ))}
                    </select>
                    {errors.gradeId?.message && (
                        <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>
                    )}
                </div>

                {/* Subject */}
                <div className="flex flex-col w-full gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subjectId")}
                        defaultValue={data?.subjectId || ""}
                    >
                        <option value="">Select Subject</option>
                        {filteredSubjects.map((subject: { id: number; name: string }) => (
                            <option value={subject.id} key={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId?.message && (
                        <p className="text-xs text-red-400">{errors.subjectId.message.toString()}</p>
                    )}
                </div>

                {/* Max Marks */}
                <InputField
                    label="Max Marks"
                    name="maxMarks"
                    defaultValue={data?.maxMarks}
                    register={register}
                    error={errors?.maxMarks}
                    type="number"
                />

                {/* Hidden ID field if updating */}
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
            </div>

            {selectedDate && examsForDate.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Exams on {new Date(selectedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </h2>

                    <ul className="space-y-2 text-sm">
                        {examsForDate.map((exam: any) => (
                            <li key={exam.id} className="border p-2 rounded-md">
                                <div><strong>{exam.title}</strong> at {new Date(`1970-01-01T${exam.examGradeSubjects[0]?.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {exam.examGradeSubjects.map((egs: any) => (
                                    <div key={egs.id} className="text-xs text-gray-600">
                                        Grade: {egs.Grade?.level}, Subject: {egs.Subject?.name}, Marks: {egs.maxMarks}
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button className="p-2 text-white bg-blue-400 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ExamForm;
