"use server"

import { revalidatePath } from "next/cache";
import {
    ClassSchema,  FeesSchema, HomeworkSchema,
    LessonsSchema,  Teacherschema
}
    from "./formValidationSchemas"
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { CurrentState } from "../../types";

// Initialize Prisma Client
const prisma = new PrismaClient();

// * ---------------------------------------------- SUBJECT SCHEMA --------------------------------------------------------

// * Example deleteMessages function
export const deleteSubject = async (prevState: any, formData: FormData) => {
    const id = formData.get("id");
    const numericId = Number(id);
    if (!numericId) {
        return {
            success: false,
            error: true,
            message: "No ID provided",
        };
    }

    try {
        await prisma.subject.delete({ where: { id: numericId } });
        return { success: true, error: false };
    } catch (error) {
        console.error("Error deleting message:", error);
        return {
            success: false,
            error: true,
            message: "Delete failed",
        };
    }
};

// * ---------------------------------------------- MESSAGE SCHEMA --------------------------------------------------------
// * Example deleteMessages function
export const deleteMessages = async (prevState: any, formData: FormData) => {
    const id = formData.get("id")?.toString();
    if (!id) {
        return {
            success: false,
            error: true,
            message: "No ID provided",
        };
    }

    try {
        await prisma.messages.delete({ where: { id } });
        return { success: true, error: false };
    } catch (error) {
        console.error("Error deleting message:", error);
        return {
            success: false,
            error: true,
            message: "Delete failed",
        };
    }
};

// * ---------------------------------------------- ANNOUNCEMENTS SCHEMA --------------------------------------------------------

// * Example deleteMessages function
export const deleteAnnouncements = async (prevState: any, formData: FormData) => {
    const id = formData.get("id")?.toString();
    const numericId = Number(id); // ✅ Convert to number

    if (!numericId || isNaN(numericId)) {
        return {
            success: false,
            error: true,
            message: "Invalid ID provided",
        };
    }

    try {
        await prisma.announcement.delete({ where: { id: numericId } }); // ✅ Use number
        return { success: true, error: false };
    } catch (error) {
        console.error("Error deleting announcement:", error);
        return {
            success: false,
            error: true,
            message: "Delete failed",
        };
    }
};

// * ---------------------------------------------- FEES SCHEMA --------------------------------------------------------

export const createFees = async (
    currentState: CurrentState,
    data: FeesSchema
) => {
    try {
        await prisma.feeStructure.create({
            data: {
                id: data.id,
                gradeId: data.gradeId, // ✅ gradeId is the primary key
                term: data.term,
                academicYear: data.academicYear,
                startDate: data.startDate,
                dueDate: data.dueDate,
                termFees: data.termFees,
                abacusFees: data.abacusFees,
            },
        });
        console.log('Fees Created:', data);
        return { success: true };
    } catch (error) {
        console.error("Error in creating Fees:", error);
        return { success: false, error: (error as any).message };
    }
};

export const updateFees = async (
    currentState: CurrentState,
    data: FeesSchema
) => {
    try {
        const id = data.id;

        // ✅ Step 1: Check if the homework exists
        const existingFees = await prisma.feeStructure.findUnique({
            where: { id: id },
        });

        if (!existingFees) {
            return { success: false, error: "Fees not found" };
        }

        // ✅ Step 2: Update only the fields that are provided
        const updatedFees = await prisma.feeStructure.update({
            where: { id: id },
            data: {
                gradeId: data.gradeId ?? existingFees.gradeId,
                term: data.term ?? existingFees.term,
                academicYear: data.academicYear ?? existingFees.academicYear,
                startDate: data.startDate ?? existingFees.startDate,
                dueDate: data.dueDate ?? existingFees.dueDate,
                termFees: data.termFees ?? existingFees.termFees,
                abacusFees: data.abacusFees ?? existingFees.abacusFees,
            },
        });

        console.log("Updated Data:", updatedFees);
        return { success: true, data: updatedFees };
    } catch (error) {
        console.error("Error in update Fees:", error);
        return { success: false, error: (error as any).message };
    }
};

export const deleteFees = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    console.log("Receved Fees Id:", data)

    try {
        await prisma.feeStructure.delete({
            where: { id: parseInt(id) },
        });

        console.log('Deleted Fees:', data)
        // revalidatePath("/list/admin")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

// * ---------------------------------------------- HOMEWORK SCHEMA --------------------------------------------------------

export const createHomework = async (
    currentState: CurrentState,
    data: HomeworkSchema
) => {
    try {
        // Insert into database
        await prisma.homework.create({
            data: {
                id: data.id,
                classId: data.classId,
                description: data.description,
                gradeId: data.gradeId
            },
        });
        console.log('Homework Created:', data)
        return { success: true };
    } catch (error) {
        console.error("Error in createHomework:", error);
        return { success: false, error: (error as any).message };
    }
};

export const updateHomework = async (
    currentState: CurrentState,
    data: HomeworkSchema
) => {
    try {
        const id = data.id;

        // ✅ Step 1: Check if the homework exists
        const existingHomework = await prisma.homework.findUnique({
            where: { id: id },
        });

        if (!existingHomework) {
            return { success: false, error: "Homework not found" };
        }

        // ✅ Step 2: Update only the fields that are provided
        const updatedHomework = await prisma.homework.update({
            where: { id: id },
            data: {
                description: data.description ?? existingHomework.description, // Keep old value if not provided
                classId: data.classId ?? existingHomework.classId, // Keep old value if not provided
                gradeId: data.gradeId ?? existingHomework.gradeId
            },
        });

        console.log("Updated Data:", updatedHomework);
        return { success: true, data: updatedHomework };
    } catch (error) {
        console.error("Error in updateHomework:", error);
        return { success: false, error: (error as any).message };
    }
};



export const deleteHomework = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    console.log("Deleted Homework:", data)

    try {
        await prisma.homework.delete({
            where: { id: parseInt(id) },
        });

        console.log('Deleted Homework:', data)
        // revalidatePath("/list/admin")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};



// * ---------------------------------------------- CLASS SCHEMA --------------------------------------------------------

export const createClass = async (
    currentState: { success: boolean; error: boolean },
    data: ClassSchema
) => {
    try {
        console.log("Testing Prisma Connection...");
        await prisma.$connect();
        console.log("Prisma is connected!");

        // Log the received data
        console.log("Received Data:", data);

        // Construct the payload
        const formattedData: any = {
            name: data.name,
            Grade: { connect: { id: Number(data.gradeId) } },
        };

        if (data.supervisorId && data.supervisorId.trim() !== "") {
            formattedData.Teacher = { connect: { id: data.supervisorId } };
        }

        // Log the formatted data before creating the class
        console.log("Final Data Before Prisma Create:", JSON.stringify(formattedData, null, 2));

        // Ensure required fields are present
        if (!formattedData.name || !formattedData.Grade.connect.id) {
            throw new Error("Invalid input: Missing required fields");
        }

        // Create the class
        const newClass = await prisma.class.create({
            data: formattedData,
        });

        console.log("Class Created Successfully:", newClass);

        return { success: true, error: false };
    } catch (err: any) {
        console.error("Create Class Error:", err);

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Error Code:", err.code);
        }

        return { success: false, error: true, message: err.message };
    }
};



export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        console.log("Updated Data:", data)
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
        console.log("Deleted Data:", data)
        await prisma.class.delete({
            where: {
                id: parseInt(id)
            },
        });

        revalidatePath("/list/class")
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
        // Initialize Clerk client
        const client = await clerkClient();

        // Check if username already exists
        const userListResponse = await client.users.getUserList({
            query: data.username,
        });

        if (userListResponse.data.length > 0) {
            throw new Error("Username is already taken.");
        }

        // Create a new user via Clerk
        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
        });

        // Create a new teacher record in Prisma
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                dob: data.dob || new Date(),
                email: data.email || null,
                phone: data.phone,
                address: data.address,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,


            },
        });

        console.log(`Created Teacher: [Username: ${data.username}, Name: ${data.name}, Password: ${data.password}]`);
        return { success: true, error: false };

    } catch (err: any) {
        console.error("Error in createTeacher:", err.errors || err);
        return {
            success: false,
            error: true,
            message: err.message || "Unprocessable Entity.",
        };
    }
};


export const updateTeacher = async (
    currentState: CurrentState,
    data: Teacherschema
) => {
    try {
        const client = await clerkClient();

        if (!data.id) {
            throw new Error("Missing teacher ID for update.");
        }

        // Ensure the user exists
        const existingUser = await client.users.getUser(data.id);
        if (!existingUser) {
            throw new Error("User not found in Clerk.");
        }

        // Construct update payload
        const updateData: any = {
            username: data.username,
            firstName: data.name,
            lastName: data.surname,
        };

        if (data.password && data.password.trim() !== "") {
            updateData.password = data.password;
        }

        if (data.email) {
            updateData.emailAddress = data.email;
        }

        console.log("Updating user with:", JSON.stringify(updateData, null, 2));

        // Update the user in Clerk
        await client.users.updateUser(data.id, updateData);

        // Update the teacher in Prisma
        const existingTeacher = await prisma.teacher.findUnique({
            where: { id: data.id },
        });

        await prisma.teacher.update({
            where: { id: data.id },
            data: {
                username: data.username,
                name: data.name,
                surname: data.surname,
                dob: data.dob || existingTeacher?.dob,
                email: data.email || null,
                phone: data.phone!,
                address: data.address!,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,

            },
        });

        return { success: true, error: false };
    } catch (err: any) {
        console.error("Error updating teacher:", err);
        if (err.errors) {
            console.error("Clerk API Errors:", JSON.stringify(err.errors, null, 2));
        }
        return { success: false, error: true, message: err.message || "Failed to update teacher." };
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

        // Log success message
        console.log(`User with ID ${id} deleted successfully`);

        // revalidatePath("/list/teachers")
        return { success: true, error: false, message: 'Deleted user successfully' };
    } catch (err) {
        console.log(err)
        return { success: false, error: true, message: 'An error occurred while deleting the user' };
    }
};


// * ---------------------------------------------- STUDENT SCHEMA --------------------------------------------------------

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    try {
        // 1. Fetch clerk_id for the student
        const student = await prisma.student.findUnique({
            where: { id },
            select: { clerk_id: true },
        });

        if (!student) {
            return { success: false, error: true, message: "Student not found in database" };
        }

        // 2. Initialize Clerk client
        const client = await clerkClient();



        // 3. Delete user from Clerk if clerk_id exists
        if (student.clerk_id) {
            await client.users.deleteUser(student.clerk_id);
        }

        // 4. Delete student from Prisma
        await prisma.student.delete({
            where: { id },
        });

        console.log(`Student with ID ${id} and Clerk ID ${student.clerk_id} deleted successfully`);
        revalidatePath("/list/users/students")
        return { success: true, error: false, message: 'Deleted user successfully' };
    } catch (err) {
        console.error("Error deleting student:", err);
        return { success: false, error: true, message: 'An error occurred while deleting the user' };
    }
};

// * ---------------------------------------------- EXAM SCHEMA --------------------------------------------------------

// export const createExam = async (
//     currentState: CurrentState,
//     data: ExamSchema
// ) => {
//     try {
//         await prisma.exam.create({
//             data: {
//                 title: data.title,
//                 date: data.date,
//                 classId: data.classId,    // Ensure classId is included
//             },
//         });

//         console.log(`Created Exam: [Title: ${data.title}, Date: ${data.date}, Lesson ID: ${data.lessonId}, Class ID: ${data.classId}]`);

//         return { success: true, error: false };
//     } catch (err) {
//         console.error("Error creating exam:", err);
//         return { success: false, error: true };
//     }
// };


// export const updateExam = async (
//     currentState: CurrentState,
//     data: ExamSchema
// ) => {
//     try {
//         await prisma.exam.update({
//             where: {
//                 id: data.id,
//             },
//             data: {
//                 title: data.title,
//                 date: data.date,
//                 classId: data.classId,    // Ensure classId is updated
//             },
//         });

//         console.log(`Updated Exam: [ID: ${data.id}, Title: ${data.title}, Date: ${data.date}, Lesson ID: ${data.lessonId}, Class ID: ${data.classId}]`);

//         return { success: true, error: false };
//     } catch (err) {
//         console.error("Error updating exam:", err);
//         return { success: false, error: true };
//     }
// };


export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id)
            },
        });

        console.log("Deleted Exam:", data)

        // revalidatePath("/list/subjects")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

// * ---------------------------------------------- ATTENDANCE SCHEMA --------------------------------------------------------// * ---------------------------------------------- LESSON SCHEMA --------------------------------------------------------

export const createLesson = async (
    currentState: CurrentState,
    data: LessonsSchema
) => {
    try {
        // Initialize Clerk client
        const client = await clerkClient();

        await prisma.lesson.create({
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
            }
        });

        console.log("Created Lesson:", "[" + data.id + ", " + data.name + ", " + data.teacherId + "]")

        // revalidatePath("/list/lessons")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

// export const updateLesson = async (
//     currentState: CurrentState,
//     data: LessonsSchema
// ) => {
//     try {
//         await prisma.lesson.update({
//             where: {
//                 id: data.id,
//             },
//             data: {
//                 name: data.name,
//                 teachers: {
//                     set: data.teachers.map((teacherId) => ({ id: teacherId })),
//                 }
//             },
//         });

//         console.log("Updated Subject:", "[" + data.id + ", " + data.name + ", " + data.teachers + "]")

//         // revalidatePath("/list/subjects")
//         return { success: true, error: false };
//     } catch (err) {
//         console.log(err)
//         return { success: false, error: true };
//     }
// };

// export const deleteLesson = async (
//     currentState: CurrentState,
//     data: FormData
// ) => {
//     const id = data.get("id") as string;
//     try {
//         await prisma.lesson.delete({
//             where: {
//                 id: parseInt(id)
//             },
//         });

//         console.log("Deleted Lesson:", data)

//         // revalidatePath("/list/subjects")
//         return { success: true, error: false };
//     } catch (err) {
//         console.log(err)
//         return { success: false, error: true };
//     }
// };