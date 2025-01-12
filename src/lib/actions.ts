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

        console.log("Created Subject:","[" + data.id + ", " + data.name + ", " + data.teachers + "]")

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

        console.log("Updated Subject:","[" + data.id + ", " + data.name + ", " + data.teachers + "]")

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

        console.log("Deleted Subject:",data)

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
        dob: data.dob,
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

        const existingTeacher = await prisma.teacher.findUnique({
            where: { id: data.id },
          });
          
          await prisma.teacher.update({
            where: { id: data.id },
            data: {
              dob: data.dob || existingTeacher?.dob, // Use existing value if not provided
              // Other fields...
            },
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
                dob: data.dob || existingTeacher?.dob, // Use existing value if not provided
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
          dob: data.dob,
          email: data.email || null,  // If no email, set to null
          phone: data.phone,
          address: data.address,
          gender: data.gender,
          img: data.img || null,
          bloodType: data.bloodType || null,
          
        },
      });
  
      return { success: true, error: false };
  
    } catch (err: any) {
      console.error("Error in createStudent:", err);
      console.error("Error details:", err.message || err);
      console.log("Clerk Error Details:", err.errors);
  
      return {
        success: false,
        error: true,
        message: err.message || "Unprocessable Entity.",
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
                  dob: data.dob,
                  email: data.email || null,
                  phone: data.phone!,
                  address: data.address!,
                  gender: data.gender,
                  img: data.img || null,
                  bloodType: data.bloodType || null,
                  
              },
          });
  
  
  
          // revalidatePath("/list/teachers")
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
  
  