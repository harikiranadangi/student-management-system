"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, LessonsSchema, Studentschema, SubjectSchema, Teacherschema } from "./formValidationSchemas"
import prisma from "./prisma"
import { auth, clerkClient } from "@clerk/nextjs/server";
import { error } from "console";
import { fetchUserInfo } from "./utils";

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

        console.log("Created Subject:", "[" + data.id + ", " + data.name + ", " + data.teachers + "]")

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
                teachers    : {
                    set: data.teachers.map((teacherId) => ({ id: teacherId })),
                }
            },
        });

        console.log("Updated Subject:", "[" + data.id + ", " + data.name + ", " + data.teachers + "]")

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

        console.log("Deleted Subject:", data)

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
        // Initialize Clerk client
        const client = await clerkClient();

        // Check if username already exists by accessing the 'data' property
        const userListResponse = await client.users.getUserList({
            query: data.username, // Ensure we search by the username
        });

        // Check if any user with the same username exists by accessing 'data'
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
                email: data.email || null,  // If no email, set to null
                phone: data.phone,
                address: data.address,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId, 10), // Ensures the ID is parsed as an integer
                    })) || [],
                },
            },
        });

        return { success: true, error: false };

    } catch (err: any) {
        console.error("Error in createTeacher:", err);
        console.error("Error details:", err.message || err);
        console.log("Clerk Error Details:", err.errors);

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
                subjects: {
                    set: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
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

export const createStudent = async (
    currentState: CurrentState,
    data: Studentschema
) => {
    try {
        // Initialize Clerk client
        const client = await clerkClient();

        const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: { _count: { select: { students: true } } }
        });

        // if (classItem && classItem.capacity === classItem._count.students) {
        //     return { success: false, error: true }
        // }

        // Check if username already exists by accessing the 'data' property
        const userListResponse = await client.users.getUserList({
            query: data.username, // Ensure we search by the username
        });

        // Check if any user with the same username exists by accessing 'data'
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
        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                parentName:data.parentName,
                dob: data.dob || new Date(),
                email: data.email || null,  // If no email, set to null
                phone: data.phone,
                address: data.address,
                gender: data.gender,
                img: data.img,
                bloodType: data.bloodType,
                classId: data.classId

            },
        });

        return { success: true, error: false };

    } catch (err: any) {
        console.error("Error creating student:", { username: data.username, classId: data.classId, err });
        console.error("Error details:", err.message || err);
        console.log("Clerk Error Details:", err.errors);

        return { 
            success: false, 
            error: true, 
            message: err.message || "An unexpected error occurred while creating the student." 
        };
        

    }
};


export const updateStudent = async (
    currentState: CurrentState,
    data: Studentschema
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

        const existingStudent = await prisma.student.findUnique({
            where: { id: data.id },
        });

        
        // Update the student in the database
        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),  // Ensure password handling is done correctly
                username: data.username,
                name: data.name,
                surname: data.surname,
                dob: data.dob || existingStudent?.dob, // Use existing value if not provided
                email: data.email || null,
                phone: data.phone!,
                address: data.address!,
                gender: data.gender,
                img: data.img || null,
                bloodType: data.bloodType || null,
                classId: data.classId
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

        // Initialize Clerk client by awaiting clerkClient()
        const client = await clerkClient();

        await client.users.deleteUser(id)

        await prisma.student.delete({
            where: {
                id: id
            },
        });

        // Log success message
        console.log(`User with ID ${id} deleted successfully`);

        // revalidatePath("/list/student")
        return { success: true, error: false, message: 'Deleted user successfully' };
    } catch (err) {
        console.log(err)
        return { success: false, error: true, message: 'An error occurred while deleting the user' };
    }
};

// * ---------------------------------------------- LESSON SCHEMA --------------------------------------------------------

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
        }});

        console.log("Created Subject:", "[" + data.id + ", " + data.name + ", " + data.teacherId + "]")

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

// * ---------------------------------------------- EXAM SCHEMA --------------------------------------------------------

export const createExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    try {
        await prisma.exam.create({
            data: {
                title: data.title,
                date: data.date,
                classId: data.classId,    // Ensure classId is included
            },
        });

        console.log(`Created Exam: [Title: ${data.title}, Date: ${data.date}, Lesson ID: ${data.lessonId}, Class ID: ${data.classId}]`);

        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating exam:", err);
        return { success: false, error: true };
    }
};


export const updateExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    try {
        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                date: data.date,
                classId: data.classId,    // Ensure classId is updated
            },
        });

        console.log(`Updated Exam: [ID: ${data.id}, Title: ${data.title}, Date: ${data.date}, Lesson ID: ${data.lessonId}, Class ID: ${data.classId}]`);

        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating exam:", err);
        return { success: false, error: true };
    }
};


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

        console.log("Deleted Subject:", data)

        // revalidatePath("/list/subjects")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
    }
};

// * ---------------------------------------------- ATTENDANCE SCHEMA --------------------------------------------------------


export const markAttendance = async (classId: string, absentees: string[]) => {
  try {
    // Fetch all students of the selected class
    const students = await prisma.student.findMany({
      where: { classId: parseInt(classId) },
      select: { id: true },
    });

    // Create attendance records
    const attendanceRecords = students.map((student) => ({
      studentId: student.id,
      date: new Date(),
      status: absentees.includes(student.id) ? "Absent" : "Present",
    }));

    // Insert attendance records into the database
    await prisma.attendance.createMany({ data: attendanceRecords });

    return { success: true, message: "Attendance marked successfully" };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return { success: false, message: "Failed to mark attendance" };
  }
};
