"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, Studentschema, SubjectSchema, Teacherschema } from "./formValidationSchemas"
import prisma from "./prisma"
import { auth, clerkClient } from "@clerk/nextjs/server";
import { error } from "console";

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


export const createTeacher = async (currentState: CurrentState, data: Teacherschema) => {
    try {
        // Initialize Clerk client
        const client = await clerkClient();

        // Debug Clerk input
        console.log("Data sent to Clerk:", {
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });

        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });

        // Debug Prisma input
        console.log("Data sent to Prisma:", {
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            dob: data.dob,
            email: data.email || null,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            img: data.img || null,
            bloodType: data.bloodType || null,
            subjects: data.subjects?.map((subjectId: string) => ({
                id: parseInt(subjectId),
            })),
        });

        // Store teacher in database
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                dob: data.dob,
                email: data.email || null,
                phone: data.phone,
                address: data.address,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });

        // revalidatePath("/list/teachers")
        return { success: true, error: false };
    } catch (err: any) {
        console.error("Error in createTeacher:", err.message);
        return {
            success: false,
            error: true,
            message: err.message || "Unprocessable Entity."
        };
    }
};



export const updateTeacher = async (
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

        if (!data.id) {
            return { success: false, error: true };
        }

        // Update the user in Clerk
        const user = await client.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        // Update the teacher in the database
        await prisma.teacher.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),  // Ensure password handling is done correctly
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
                    set: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    })),
                },
            },
        });



        // revalidatePath("/list/teachers")
        return { success: true, error: false };
    } catch (err) {
        console.error(err);
        return { success: false, error: true };
    }


};


export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {

        // Initialize Clerk client by awaiting clerkClient()
        const client = await clerkClient();

        await client.users.deleteUser(id)

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

// * ---------------------------------------------- STUDENT SCHEMA --------------------------------------------------------

export const createStudent = async (currentState: CurrentState, data: Studentschema) => {
    try {

        const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: { _count: { select: { students: true } } },
        });
        // Initialize Clerk client
        const client = await clerkClient();

        // Debug Clerk input
        console.log("Data sent to Clerk:", {
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });

        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });

        // Debug Prisma input
        console.log("Data sent to Prisma:", {
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            dob: data.dob,
            email: data.email || null,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            img: data.img || null,
            bloodType: data.bloodType || null,
            gradeId: data.gradeId,
            classId: data.classId,
        });

        // Store teacher in database
        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                parentName: data.parentName,
                dob: data.dob,
                email: data.email || null,
                phone: data.phone,
                address: data.address,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,
                gradeId: data.gradeId,
                classId: data.classId,

            },
        });

        // revalidatePath("/list/students")
        return { success: true, error: false };
    } catch (err: any) {
        console.error("Error in createTeacher:", err.message);
        return {
            success: false,
            error: true,
            message: err.message || "Unprocessable Entity."
        };
    }
};



export const updateStudent = async (
    currentState: CurrentState,
    data: Studentschema
) => {
    try {

        // if(classItem && classItem.capacity === classItem._count.students){
        //     return { success: false, error: true }
        // }


        // Initialize Clerk client by awaiting clerkClient()
        const client = await clerkClient();

        // Ensure the Clerk client has the 'users' API
        if (!client.users) {
            throw new Error("Clerk client does not have the 'users' API.");
        }

        if (!data.id) {
            return { success: false, error: true };
        }

        // Update the user in Clerk
        const user = await client.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        // Update the teacher in the database
        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),  // Ensure password handling is done correctly
                username: data.username,
                name: data.name,
                surname: data.surname,
                parentName: data.parentName,
                dob: data.dob,
                email: data.email || null,
                phone: data.phone!,
                address: data.address!,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,
                gradeId: data.gradeId,
                classId: data.classId,
            },
        });



        // revalidatePath("/list/students")
        return { success: true, error: false };
    } catch (err) {
        console.error(err);
        return { success: false, error: true };
    }


};


export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const client = await clerkClient();

        await client.users.deleteUser(id)

        await prisma.student.delete({
            where: {
                id: id
            },
        });

        // revalidatePath("/list/students")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};


// * ----------------------------------EXAM FORM -------------------------------------------------

export const createExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {

    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {

        if(role === "teacher") {

        const teacherLesson = await prisma.lesson.findFirst({
            where: {
                teacherId: userId!,
                id: data.lessonId,
            }

        });

        if (!teacherLesson) {
            return { success: false, error: true }
        }
    }


        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId
            }
        });

    // revalidatePath("/list/exams")
    return { success: true, error: false };
} catch (err) {
    console.log(err)
    return { success: false, error: true };
}
};

export const updateExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {

        if(role === "teacher") {

            
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                }
                
            });
            
            if (!teacherLesson) {
                return { success: false, error: true }
            }
        }


        await prisma.exam.update({
            where:{
               id: data.id, 
            },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId
            }
        });

        // revalidatePath("/list/exams")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { sessionClaims, userId } = await auth();

    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        // revalidatePath("/list/exams")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};