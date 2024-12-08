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

  // Define the schema with zod
export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Class Name is required!' }),  
    supervisorId: z.coerce.string().optional(),  
    gradeId: z.coerce.number().min(1, { message: 'gradeId is required!' }),  

  });
  
  // Infer the form data type from schema
  export type ClassSchema = z.infer<typeof classSchema>;


  export const teacherschema = z.object({
    id: z.string().optional(),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long!" })
      .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z
      .string()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
    name: z.string().min(1, { message: "Name is required!" }),
    surname: z.string().min(1, { message: "Surname is required!" }),
    gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
    phone: z.string(),
    address: z.string().min(1, { message: "Address is required!" }), // Made address mandatory
    bloodType: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"], {
        message: "Please select a valid blood type!",
      })
      .optional(),
    dob: z.coerce.date({ message: "Date of Birth is required!" }),
    img: z.string().optional(),
    supervisor: z.boolean().optional(),
    subjects: z.array(z.string()).optional(), // For related Subject IDs
  });
  
  // Infer the form data type from schema
  export type Teacherschema = z.infer<typeof teacherschema>;
  