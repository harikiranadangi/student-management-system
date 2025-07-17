"use client";

import Link from "next/link";

interface SampleCSVPreviewProps {
    type: "student" | "teacher" | "grades" | "classes";
}

const SampleCSVPreview = ({ type }: SampleCSVPreviewProps) => {
    let sampleRows: Record<string, string>[] = [];

    switch (type) {
        case "teacher":
            sampleRows = [
                {
                    id: "t001",
                    username: "teach001",
                    name: "Amit Sharma",
                    parentName: "Suresh Sharma",
                    email: "teach001@kotakschool.com",
                    phone: "9876543210",
                    address: "42 Hill Road",
                    img: "teacher1.jpg",
                    bloodType: "A+",
                    gender: "Male",
                    dob: "1985-05-10",
                    classId: "1",
                    clerk_id: "",
                },
                {
                    id: "t002",
                    username: "teach002",
                    name: "Sunita Rani",
                    parentName: "Mahesh Rani",
                    email: "teach002@kotakschool.com",
                    phone: "9876543211",
                    address: "89 Garden Lane",
                    img: "teacher2.jpg",
                    bloodType: "O-",
                    gender: "Female",
                    dob: "1988-07-15",
                    classId: "2",
                    clerk_id: "",
                },
            ];
            break;

        case "grades":
            sampleRows = [
                {
                    id: "1",
                    level: "LKG",
                },
                {
                    id: "2",
                    level: "UKG",
                },
                {
                    id: "3",
                    level: "1",
                },
            ];
            break;

        case "classes":
            sampleRows = [
                {
                    id: "1",
                    section: "A",
                    gradeId: "1",
                    supervisorId: "t001",
                },
                {
                    id: "2",
                    section: "B",
                    gradeId: "1",
                    supervisorId: "t002",
                },
            ];
            break;

        default: // student
            sampleRows = [
                {
                    id: "s001",
                    username: "stu001",
                    name: "Ravi Kumar",
                    parentName: "Suresh Kumar",
                    email: "stu001@kotakschool.com",
                    phone: "9876543210",
                    address: "123 Street",
                    img: "A.jpg",
                    bloodType: "B+",
                    gender: "Male",
                    dob: "15-04-2009",
                    classId: "1",
                    clerk_id: "",
                    academicYear: "Y2024_2025",
                },
                {
                    id: "s002",
                    username: "stu002",
                    name: "Meena Devi",
                    parentName: "Rajesh Devi",
                    email: "stu002@kotakschool.com",
                    phone: "9876543211",
                    address: "456 Road",
                    img: "B.jpg",
                    bloodType: "O+",
                    gender: "Female",
                    dob: "10-06-2010",
                    classId: "1",
                    clerk_id: "",
                    academicYear: "Y2024_2025",
                },
            ];
            break;
    }

    const downloadLink = {
        student: "/sample/student-bulk-template.csv",
        teacher: "/sample/teacher-bulk-template.csv",
        grades: "/sample/grade-bulk-template.csv",
        classes: "/sample/class-bulk-template.csv",
    };

    const titleMap = {
        student: "Student",
        teacher: "Teacher",
        grades: "Grade",
        classes: "Class",
    };

    return (
        <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1">
                📄 {titleMap[type]} CSV Preview
            </h2>

            <div className="overflow-auto border border-gray-200 rounded">
                <table className="min-w-full text-xs text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            {Object.keys(sampleRows[0]).map((key) => (
                                <th
                                    key={key}
                                    className="px-3 py-2 border-b text-gray-700 whitespace-nowrap"
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sampleRows.map((row, i) => (
                            <tr key={i} className="even:bg-gray-50">
                                {Object.values(row).map((val, j) => (
                                    <td key={j} className="px-3 py-1 border-b whitespace-nowrap">
                                        {val || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-3">
                <Link
                    href={downloadLink[type]}
                    download
                    className="text-sm bg-LamaPurple text-black px-4 py-2 rounded hover:bg-LamaPurpleLight transition"
                >
                    Download Sample CSV
                </Link>
            </div>
        </div>
    );
};

export default SampleCSVPreview;
