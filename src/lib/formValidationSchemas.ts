import { AcademicYear } from "@prisma/client";
import { group } from "console";
import { z } from "zod";

export const resultschema = z.object({
  id: z.number().optional(),  // Optional for updates, needed for identifying the result
  studentId: z.string().min(1, "Student ID is required"),  // Student ID is required
  examId: z.number().min(1, "Exam ID is required").int("Exam ID must be an integer"),  // Exam ID is required and should be an integer
  subjectId: z.number().min(1, "Subject ID is required").int("Subject ID must be an integer"),  // Subject ID is required and should be an integer
  gradeId: z.number().min(1, "Grade ID is required").int("Grade ID must be an integer"),  // Grade ID is required and should be an integer
  marks: z
    .number()
    .min(0, "Marks cannot be negative")  // Marks should be greater than or equal to 0
    .max(100, "Marks cannot exceed 100")  // Marks should be less than or equal to 100
    .int("Marks must be an integer"),  // Marks should be an integer
  createdAt: z.date().default(new Date()),  // Date the result was created (defaults to the current date if not provided)
});

export type ResultSchema = z.infer<typeof resultschema>;

// * Message Schema
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

export const classSchema = z
  .object({
    id: z.coerce.number().optional(), // 👈 Add this
    section: z.enum(["A", "B", "C", "D", "E"]),
    name: z.string().optional(), // auto-generated
    supervisorId: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().optional()
    ),
    gradeId: z.coerce.number().min(1, { message: "Grade selection is required!" }),
  })
  .strict(); // ✅ prevent extra keys like "id"


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
  parentName: z.string().min(1, { message: "Parent Name is required!" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }), // Made address mandatory
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"]).optional()
    .default("Under Investigation"),
  dob: z.union([z.coerce.date(), z.string().length(0)]).optional(),
  img: z.string().optional().nullable(),
  email: z.string().email({ message: "Invalid email address!" }).optional().nullable(),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  subjects: z.array(
    z.object({
      subjectId: z.number(),
      classId: z.number(),
    })
  ).optional()


});

// Infer the form data type from schema
export type Teacherschema = z.infer<typeof teacherschema>;

// Student Schema
export const studentschema = z.object({
  id: z.string().optional(),
  username: z.string().min(5, { message: "Username must be at least 5 characters long!" }).optional(),
  password: z.string().min(5, { message: "Password must be at least 5 characters long!" })
    .optional().or(z.literal("")),
  name: z.string().min(1, { message: "Name is required!" }),
  parentName: z.string().min(1, { message: "Parent Name is required!" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Under Investigation"])
    .default("Under Investigation"),
  dob: z.union([z.coerce.date(), z.literal(""), z.null()]).optional(),

  img: z.string().optional().nullable(),
  email: z.string().email({ message: "Invalid email address!" }).optional().nullable(),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  academicYear: z.nativeEnum(AcademicYear, { message: "Academic year is required!" }),
});

// Infer the form data type from schema
export type Studentschema = z.infer<typeof studentschema>;

// Define the schema with zod
export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Title is required!' }),
  examDate: z.coerce.date({ message: 'Exam Date is required!' }),
  startTime: z.string().min(1, { message: 'Start Time is required!' }),
  gradeId: z.coerce.number({ message: 'Grade is required!' }),
  subjectId: z.coerce.number({ message: 'Subject is required!' }),
  maxMarks: z.coerce.number({ message: 'Max Marks is required!' }).min(1, { message: 'Max Marks must be greater than 0!' }),
});

export type ExamSchema = z.infer<typeof examSchema>;

// Define the lessons schema with zod
export const lessonsSchema = z.object({
  id: z.number().optional(),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
  startTime: z.string(),
  endTime: z.string(),
  subjectId: z.number(),
  classId: z.number(),
  teacherId: z.string(),
});

// Infer the form data type from the schema
export type LessonsSchema = z.infer<typeof lessonsSchema>;

// * Homework Schema
export const homeworkSchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.string().or(z.date()), // Accept both string and Date
  classId: z.coerce.number().optional(),
  gradeId: z.coerce.number().int(),
  groupId: z.string().optional(), // Optional for grouped homeworks
});

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


