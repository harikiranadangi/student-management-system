import { AcademicYear } from "@prisma/client";
import { z } from "zod";



export const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  type: z.enum(["ABSENT", "FEE_RELATED", "ANNOUNCEMENT", "GENERAL"]),  // Enum for message types
  studentId: z.string().optional(),
  classId: z.number().optional(),
  gradeId: z.number().optional(),
  date: z.string().min(1, "Date is required"),

});

export type MessageSchema = z.infer<typeof messageSchema>;


export const announcementSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  date: z.coerce.date({ message: "Date is required!" }),
  classId: z.coerce.number().optional()
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;


export const adminSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, { message: "Username is required!" }),
  full_name: z.string().min(1, { message: "Full Name is required!" }),
  password: z.string().min(5, { message: "Password must be at least 5 characters!" }),
  parentName: z.string().optional(),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  email: z.string().email({ message: "Invalid email!" }).optional(),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"]).optional(),
  dob: z.coerce.date().optional(),
  img: z.string().optional().nullable(),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone must be 10 digits!" }),
});

export type AdminSchema = z.infer<typeof adminSchema>;



export const subjectSchema = z.object({
  id: z.coerce.number().optional(), // id is optional for create operation
  name: z.string().min(1, { message: 'Subject Name is required!' }), // Ensure name is not empty
  gradeId: z.array(z.coerce.number().min(1, { message: 'Grade ID is required!' })).nonempty({ message: 'At least one grade is required!' }), // Making gradeId an array
  
});

// Infer the form data type from schema
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Class Name is required!" }),
  supervisorId: z.string().nullable().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade selection is required!" }),
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
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }), // Made address mandatory
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"]).optional()
    .default("Under Investigation"),
  dob: z.union([z.coerce.date(), z.string().length(0)]).optional(),
  img: z.string().optional().nullable(),
  email: z.string().email({ message: "Invalid email address!" }).optional().nullable(),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  subjects: z.array(z.string()).optional(), // For related Subject IDs

});

// Infer the form data type from schema
export type Teacherschema = z.infer<typeof teacherschema>;

// Student Schema
export const studentschema = z.object({
  id: z.string().optional(),
  username: z.string().min(5, { message: "Username must be at least 5 characters long!" }),
  password: z.string().min(5, { message: "Password must be at least 5 characters long!" })
    .optional().or(z.literal("")),
  name: z.string().min(1, { message: "Name is required!" }),
  surname: z.string().min(1, { message: "Surname is required!" }),
  parentName: z.string().min(1, { message: "Parent Name is required!" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"])
    .default("Under Investigation"),
  dob: z.union([z.coerce.date(), z.string().length(0)]).optional(),
  img: z.string().optional().nullable(),
  email: z.string().email({ message: "Invalid email address!" }).optional().nullable(),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  academicYear: z.nativeEnum(AcademicYear).optional(),
});

// Infer the form data type from schema
export type Studentschema = z.infer<typeof studentschema>;

// Define the schema with zod
export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Title Name is required!' }),
  date: z.coerce.date({ message: 'Start Time is required!' }),
  lessonId: z.coerce.number({ message: 'Lesson is required!' }),
  classId: z.coerce.number({ message: 'Class is required!' }),

});

// Infer the form data type from schema
export type ExamSchema = z.infer<typeof examSchema>;

// Define the lessons schema with zod
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

// * Homework Schema

export const homeworkSchema = z.object({
  id: z.number().optional(), // Auto-incremented ID
  classId: z.number({ message: "Class ID is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  gradeId: z.number({ message: "Class ID is required!" }),
});

// Infer the form data type from the schema
export type HomeworkSchema = z.infer<typeof homeworkSchema>;

// * FeeManagementSchema Schema

export const feesSchema = z.object({
  id: z.number().optional(), // Auto-incremented ID
  gradeId: z.number({ message: "Class ID is required!" }),
  term: z.enum(["TERM_1", "TERM_2", "TERM_3", "TERM_4"]),
  academicYear: z.enum(["Y2024_2025", "Y2025_2026"]),
  startDate: z.coerce.date({ message: "Start Date is required!" }),
  dueDate: z.coerce.date({ message: "Due Date is required!" }),
  termFees: z.coerce.number().min(0, "Term Fees is required!"),
  abacusFees: z.coerce.number().min(0, "Abacus Fees is required!"),
});

// Infer the form data type from the schema
export type FeesSchema = z.infer<typeof feesSchema>;


