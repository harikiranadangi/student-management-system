"use server"

import { revalidatePath } from "next/cache";
import { AdminSchema, ClassSchema, ExamSchema, FeeCollectionSchema, FeesSchema, HomeworkSchema, LessonsSchema, Studentschema, SubjectSchema, Teacherschema } from "./formValidationSchemas"
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma, PrismaClient } from "@prisma/client";

type CurrentState = { success: boolean; error: boolean }

// * ---------------------------------------------- FEE COLLECTION SCHEMA --------------------------------------------------------

export const createFeeCollect = async (
    currentState: CurrentState,
    data: FeeCollectionSchema
) => {
    try {
        // ✅ Step 1: Get student's grade from their class
        const student = await prisma.student.findUnique({
            where: { id: data.studentId },
            select: { Class: { select: { Grade: true } } }
        });

        if (!student || !student.Class) {
            return { success: false, error: "Student's grade not found!" };
        }

        const studentGrade = student.Class.Grade;

        // ✅ Step 2: Get fee structure for the grade and term
        const feeStructure = await prisma.feeStructure.findFirst({
            where: {
                grade: studentGrade, // Match the grade
                term: data.term      // Match the term
            },
            select: { id: true }
        });

        if (!feeStructure) {
            return { success: false, error: "Fee structure not found for this grade!" };
        }

        // ✅ Step 3: Insert or update fee collection with auto-filled `feeStructureId`
        const studentFees = await prisma.studentFees.upsert({
            where: {
                studentId_term_fbNumber: {
                    studentId: data.studentId,
                    term: data.term,
                    fbNumber: data.fbNumber
                }
            },
            update: {
                paidAmount: { increment: data.paidAmount },
                abacusPaidAmount: { increment: data.abacusPaidAmount ?? 0 },
                discountAmount: { increment: data.discountAmount ?? 0 },
                fineAmount: { increment: data.fineAmount ?? 0 },
            },
            create: {
                studentId: data.studentId,
                term: data.term,
                feeStructureId: feeStructure.id, // ✅ Auto-filled from DB
                fbNumber: data.fbNumber,

                paidAmount: data.paidAmount,
                abacusPaidAmount: data.abacusPaidAmount,
                discountAmount: data.discountAmount,
                fineAmount: data.fineAmount,
                paymentMode: data.paymentMode,
                receivedDate: data.receivedDate,
                receiptDate: data.receiptDate,
            },
        });

        console.log('✅ Fee Collection Recorded:', data);
        return { success: true };
    } catch (error) {
        console.error("❌ Error in Fee Collection:", error);
        return { success: false, error: (error as any).message };
    }
};

export const updateFeeCollect = async (
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

export const deleteFeeCollect = async (
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
        console.error("Error in createAdmin:", error);
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

// * ---------------------------------------------- SUBJECT SCHEMA --------------------------------------------------------

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        console.log("Received Data:", data);

        if (!data || !data.name) {
            throw new Error("Invalid input: 'name' is required.");
        }

        const teacherIds = Array.isArray(data.teachers) ? data.teachers : [];

        // Create the subject first
        const newSubject = await prisma.subject.create({
            data: { name: data.name },
        });

        console.log("Created Subject ID:", newSubject.id);

        // Validate teachers before assigning them
        if (teacherIds.length > 0) {
            console.log("Validating teachers:", teacherIds);

            const validTeachers = await prisma.teacher.findMany({
                where: { id: { in: teacherIds } },
                select: { id: true },
            });

            const validTeacherIds = validTeachers.map((teacher) => teacher.id);
            console.log("Valid Teacher IDs:", validTeacherIds);

            // 🚀 Check if validTeacherIds is not empty before `createMany`
            if (validTeacherIds.length > 0) {
                const teacherSubjectData = validTeacherIds.map((teacherId) => ({
                    teacherId,
                    subjectId: newSubject.id,
                }));

                console.log("Data for createMany:", teacherSubjectData);

                await prisma.teacherSubject.createMany({
                    data: teacherSubjectData,
                    skipDuplicates: true,
                });

                console.log("Assigned Teachers:", validTeacherIds);
            } else {
                console.log("No valid teachers found. Skipping createMany.");
            }
        } else {
            console.log("No teachers assigned.");
        }

        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating subject:", err);
        return { success: false, error: true };
    }
};


export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        console.log("Received Update Data:", data);

        if (!data.id || !data.name) {
            throw new Error("Invalid input: 'id' and 'name' are required.");
        }

        const teacherIds = Array.isArray(data.teachers) ? data.teachers : [];

        // ✅ Ensure `subjectId` is always a number
        if (!data.id) {
            throw new Error("Invalid subject ID");
        }

        const subjectId = data.id; // Now TypeScript knows subjectId is always defined

        // ✅ Step 1: Update the Subject name
        await prisma.subject.update({
            where: { id: subjectId },
            data: { name: data.name },
        });

        console.log("Updated Subject Name:", data.name);

        // ✅ Step 2: Update the Many-to-Many Relationship in `teacherSubject`
        if (teacherIds.length > 0) {
            console.log("Updating teachers:", teacherIds);

            // ✅ Delete existing teacher assignments for the subject
            await prisma.teacherSubject.deleteMany({
                where: { subjectId },
            });

            console.log("Removed previous teacher assignments");

            // ✅ Insert new teacher assignments
            const teacherSubjectData: Prisma.TeacherSubjectCreateManyInput[] = teacherIds.map(
                (teacherId) => ({
                    teacherId,
                    subjectId, // ✅ Ensured `subjectId` is defined
                })
            );

            await prisma.teacherSubject.createMany({
                data: teacherSubjectData,
                skipDuplicates: true,
            });

            console.log("Assigned New Teachers:", teacherIds);
        } else {
            // ✅ If no teachers are provided, remove all existing assignments
            await prisma.teacherSubject.deleteMany({
                where: { subjectId },
            });
            console.log("All teacher assignments removed for subject:", subjectId);
        }

        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating subject:", err);
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



// Initialize Prisma Client
const prisma = new PrismaClient();

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
                parentName: data.parentName,
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

        // Log success message
        console.log(`Created Student: [Username: ${data.username}, Name: ${data.name}, Password: ${data.password}, Class ID: ${data.classId}]`);

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




// * ---------------------------------------------- ADMIN SCHEMA --------------------------------------------------------

export const createAdmin = async (
    currentState: CurrentState,
    data: AdminSchema
) => {
    try {
        // Ensure required fields are valid
        if (!data.username || !data.full_name || !data.email || !data.password) {
            throw new Error("Missing required fields: username, full_name, email, or password.");
        }

        // Insert into database
        await prisma.admin.create({
            data: {
                username: data.username,  // Ensure it's a string
                full_name: data.full_name || "Unknown", // Default to "Unknown" if missing
                email: data.email,  // Ensure valid email
                password: data.password,  // Ensure password is always provided
                parentName: data.parentName || null,  // Optional field
                gender: data.gender || null,
                address: data.address || null,
                dob: data.dob,  // Convert to Date
                phone: data.phone,  // Default to dummy phone if missing
            },
        });

        console.log('Admin Created:', data)
        return { success: true };
    } catch (error) {
        console.error("Error in createAdmin:", error);
        return { success: false, error: (error as any).message };
    }
};


export const updateAdmin = async (
    currentState: CurrentState,
    data: AdminSchema
) => {
    try {

        console.log("Received Update Data:", data);

        if (!data.id || !data.full_name) {
            throw new Error("Invalid input: 'id' and 'name' are required.");
        }

        // ✅ Ensure `subjectId` is always a number
        if (!data.id) {
            throw new Error("Invalid Admin ID");
        }

        const adminId = data.id; // Now TypeScript knows subjectId is always defined

        // ✅ Step 1: Update the Subject name
        await prisma.admin.update({
            where: { id: adminId },
            data: {
                username: data.username,
                full_name: data.full_name,
                email: data.email,
                password: data.password,
                parentName: data.parentName,
                gender: data.gender,
                address: data.address,
                dob: data.dob ? new Date(data.dob) : null,  // Convert to Date
                phone: data.phone,
            },
        });

        console.log("Updated Data:", data);
        return { success: true, error: false };
    } catch (error) {
        console.error("Error in updateAdmin:", error);
        return { success: false, error: (error as any).message };
    }
};

export const deleteAdmin = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.admin.delete({
            where: {
                id: parseInt(id)
            },
        });

        console.log("Deleted Admin:", data)

        // revalidatePath("/list/admin")
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return { success: false, error: true };
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