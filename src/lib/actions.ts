"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, SubjectSchema, Teacherschema } from "./formValidationSchemas"
import prisma from "./prisma"
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean }


// * ---------------------------------------------- SUBJECT SCHEMA --------------------------------------------------------

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({ id: teacherId })),
                }
            },
        });

        // revalidatePath("/list/subjects")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({ id: teacherId })),
                }
            },
        });

        // revalidatePath("/list/subjects")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const deleteSubject = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            },
        });

        // revalidatePath("/list/subjects")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

// * ---------------------------------------------- CLASS SCHEMA --------------------------------------------------------

export const createClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.class.create({
            data: {
                name: data.name,
                supervisorId: data.supervisorId,
                gradeId: data.gradeId,
            },
        });

        // revalidatePath("/list/class")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.class.update({
            where: { id: data.id },
            data: {
                name: data.name,
                supervisorId: data.supervisorId,
                gradeId: data.gradeId,
            },
        });

        // revalidatePath("/list/class")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id)
            },
        });

        // revalidatePath("/list/class")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

// * ---------------------------------------------- TEACHER SCHEMA --------------------------------------------------------


export const createTeacher = async (
    currentState: CurrentState,
    data: Teacherschema
) => {
    try {

        // Initialize Clerk client by awaiting clerkClient()
        const client = await clerkClient();

        // Ensure the Clerk client has the 'users' API
        if (!client.users) {
            throw new Error("Clerk client does not have the 'users' API.");
        }

        // Create the user in Clerk
        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                dob: data.dob,
                email: data.email || null,
                phone: data.phone!,
                address: data.address!,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    })),
                },
            },
        });

        // revalidatePath("/list/teachers")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const updateTeacher = async (
    currentState: CurrentState,
    data: Teacherschema
) => {
    try {
        await prisma.teacher.update({
            where: { id: data.id },
            data: {
                name: data.name,
                // supervisorId: data.supervisorId,
                // gradeId: data.gradeId,
            },
        });

        // revalidatePath("/list/teachers")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.teacher.delete({
            where: {
                id: id
            },
        });

        // revalidatePath("/list/teachers")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

