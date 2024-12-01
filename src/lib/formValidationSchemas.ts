import { z } from "zod";

// Define the schema with zod
export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
    .string()
    .min(1, { message: 'Subject Name is required!' }),  
    teachers: z.array(z.string()), // teacher id's
    
  });
  
  // Infer the form data type from schema
  export type SubjectSchema = z.infer<typeof subjectSchema>;