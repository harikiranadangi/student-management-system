"use client";

import Link from "next/link";

const SampleCSVPreview = () => {
    const sampleRows = [
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

    return (
        <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1">
                📄 Sample CSV Preview
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
                    href="/sample/student-bulk-template.csv"
                    download
                    className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Download Sample CSV
                </Link>
            </div>

        </div>
    );
};

export default SampleCSVPreview;
