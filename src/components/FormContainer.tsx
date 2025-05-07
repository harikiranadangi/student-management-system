import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { fetchUserInfo } from "@/lib/utils";

export type FormContainerProps = {
    table:
    | "teacher"
    | "student"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "attendance"
    | "event"
    | "announcement"
    | "fees"
    | "admin"
    | "fees_structure"
    | "messages"
    | "results"
    | "homeworks";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
}

const FormContainer = async ({ table, type, data, id, }: FormContainerProps) => {

    let relatedData = {}



    if (type !== "delete") {

        switch (table) {
            case "subject":

                const subjectGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true },
                });

                relatedData = { grades: subjectGrades, teachers: subjectTeachers }
                break;

            case "class":

                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });

                relatedData = { teachers: classTeachers, grades: classGrades }
                break;

            case "teacher":

                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });

                relatedData = { subjects: teacherSubjects }
                break;

            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                const studentClasses = await prisma.class.findMany({
                    include: {
                        _count: { select: { students: true } },
                        Grade: true, // ✅ important
                    },
                });

                const studentFees = await prisma.feeStructure.findMany({
                    select: {
                        id: true,
                        gradeId: true,
                        term: true,
                        academicYear: true,
                        startDate: true,
                        dueDate: true,
                        termFees: true,
                        abacusFees: true,
                    },
                });

                relatedData = {
                    classes: studentClasses,
                    grades: studentGrades,
                    feeStructures: studentFees, // ✅ added
                };
                break;


            case "exam":

                const examGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const examSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                })

                relatedData = { grades: examGrades, subjects: examSubjects }
                break;

            case "lesson":

                // Fetch related data for dropdowns or selection options
                const lessonSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });

                const lessonClasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                });

                const lessonTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });

                relatedData = { subjects: lessonSubjects, classes: lessonClasses, teachers: lessonTeachers };
                break;

            case 'homeworks':
                const classHomework = await prisma.class.findMany({
                    select: { id: true, name: true },
                });

                const gradeHomework = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                relatedData = { classes: classHomework, grades: gradeHomework };
                break;

            case "fees":
                // Fetch Grades
                const gradeFees = await prisma.grade.findMany({
                    select: { id: true, level: true }, // ✅ Grade ID & Level
                });

                // Fetch Fees Structure
                const feesGrades = await prisma.feeStructure.findMany({
                    select: {
                        gradeId: true,   // ✅ Link Fees to Grade
                        termFees: true,
                        abacusFees: true,
                        startDate: true,
                        dueDate: true,
                    },
                });

                relatedData = { grades: gradeFees, fees: feesGrades };
                break;

            case 'announcement':
                const classAnnouncement = await prisma.class.findMany({
                    select: { id: true, name: true },
                });

                const gradeAnnouncement = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                relatedData = { classes: classAnnouncement, grades: gradeAnnouncement };
                break;

            case 'messages':
                // Fetch grades
                const gradeMessages = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                // Fetch classes based on the grade
                const classMessages = await prisma.class.findMany({
                    select: { id: true, name: true, gradeId: true }, // Including gradeId to associate classes with grades
                });

                // Fetch students based on the class
                const studentMessages = await prisma.student.findMany({
                    select: { id: true, name: true, classId: true },
                });

                // Organize the data in a structured way
                relatedData = {
                    grades: gradeMessages,
                    classes: classMessages,
                    students: studentMessages,
                };
                break;

            case 'results':
                // Fetch grades
                const gradeResults = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });

                // Fetch exams based on the grade
                const examresults = await prisma.exam.findMany({
                    select: {
                        id: true,
                        title: true,
                        examGradeSubjects: {
                            select: {
                                id: true,
                                gradeId: true,
                                subjectId: true,
                                maxMarks: true,
                                date: true,
                                startTime: true,
                            },
                        },
                    }, // Including gradeId to associate exams with grades
                });

                const studentResults = await prisma.student.findMany({
                    select: { id: true, name: true, classId: true },
                });

                // Fetch subjects based on the exam
                const subjectResults = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });

                const classesResults = await prisma.class.findMany({
                    select: { id: true, name: true, gradeId: true }, // Including gradeId to associate classes with grades
                });

                relatedData = {
                    grades: gradeResults,  // List of grades
                    examGradeSubjects: examresults.flatMap(exam => exam.examGradeSubjects),  // Flatten the exams and their examGradeSubjects
                    students: studentResults,  // List of students
                    subjects: subjectResults,  // List of subjects
                    classes: classesResults,  // List of classes
                };
                break;

            default:
        }
    }




    return (
        <div className="">
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;