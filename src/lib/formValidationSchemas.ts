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

// Teacher Schema
export const teacherschema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z.string().min(5, { message: "Password must be at least 5 characters long!" }).optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Name is required!" }),
  surname: z.string().min(1, { message: "Surname is required!" }),
  email: z.string().email({ message: "Invalid email address!" }).optional().or(z.literal(""))
    .nullable(),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }), // Made address mandatory
  img: z.string().optional(),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"]).optional()
    .default("Under Investigation"),
  dob: z.coerce.date().optional(), // Mark as optional
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  subjects: z.array(z.string()).optional(), // For related Subject IDs
});

// Infer the form data type from schema
export type Teacherschema = z.infer<typeof teacherschema>;

// Student Schema
export const studentschema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long!" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long!" })
    .optional().or(z.literal("")),
  name: z.string().min(1, { message: "Name is required!" }),
  surname: z.string().min(1, { message: "Surname is required!" }),
  parentName: z.string().min(1, { message: "Parent Name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z
  .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"])
  .default("Under Investigation"),
  dob: z.coerce.date().optional().or(z.literal("")),
  img: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),

});

// Infer the form data type from schema
export type Studentschema = z.infer<typeof studentschema>;


// Define the schema with zod
export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(1, { message: 'Title Name is required!' }),
  startTime: z.coerce.date({ message: 'Start Time is required!' }),
  endTime: z.coerce.date({ message: 'End Time is required!' }),
  lessonId: z.coerce.number({ message: 'Lesson is required!' }),

});

// Infer the form data type from schema
export type ExamSchema = z.infer<typeof examSchema>;


// Assuming LessonSchema is defined using zod
export const lessonsSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
  startTime: z.string(),
  endTime: z.string(),
  subjectId: z.number(),
  classId: z.number(),
  teacherId: z.string(),


  // Relations
  subject: z.object({ id: z.coerce.number(), name: z.string() }).optional(),
  class: z.object({ id: z.coerce.number(), name: z.string() }).optional(),
  teacher: z.object({ id: z.string(), name: z.string() }).optional(),
});

// Infer the form data type from the schema
export type LessonsSchema = z.infer<typeof lessonsSchema>;
