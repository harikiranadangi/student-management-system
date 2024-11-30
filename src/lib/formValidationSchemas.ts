import { z } from "zod";

// Define the schema with zod
export const subjectSchema = z.object({
    id: z.number().optional(),
    name: z
    .string()
    .min(1, { message: 'Subject Name is required!' }),  
    
  });
  
  // Infer the form data type from schema
  export type SubjectSchema = z.infer<typeof subjectSchema>;