"use server"

import { revalidatePath } from "next/cache";
import { SubjectSchema } from "./formValidationSchemas"
import prisma from "./prisma"
import { error } from "console";

type CurrentState = {success:boolean;error:boolean}

export const createSubject = async (
    currentState: CurrentState, 
    data:SubjectSchema
) => {
    try{
        await prisma.subject.create({
            data: { 
                name: data.name,
            },
        });
     
        // revalidatePath("/list/subjects")
        return { success:true, error: false};
    }   catch (err) {
        console.log(err)
        return { success:false, error: true};
    }
};

export const updateSubject = async (
    currentState: CurrentState, 
    data:SubjectSchema
) => {
    try{
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: { 
                name: data.name,
            },
        });
     
        // revalidatePath("/list/subjects")
        return { success:true, error: false};
    }   catch (err) {
        console.log(err)
        return { success:false, error: true};
    }
};

export const deleteSubject = async (
    currentState: CurrentState, 
    data:SubjectSchema
) => {
    try{
        await prisma.subject.delete({
            where: {
                id: data.id
            },
            
        });
     
        // revalidatePath("/list/subjects")
        return { success:true, error: false};
    }   catch (err) {
        console.log(err)
        return { success:false, error: true};
    }
};