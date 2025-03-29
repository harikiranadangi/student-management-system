"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const FeeCollectionPage = () => {
    const params = useParams();
    const studentId = params.id;
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await fetch(`/api/fees/${studentId}`);
                const data = await res.json();
                setFees(data);
            } catch (error) {
                console.error("Error fetching fees:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, [studentId]);

    if (loading) return <p>Loading...</p>;

    if (!fees.length) return <p>No fees found for this student.</p>;

    console.log("Fees Data:", fees);


    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold">
                Fee Collection for {fees.length > 0 && fees[0]?.studentName}
            </h1>
            <p className="font-semibold">Class: {fees.length > 0 && fees[0]?.studentClass ? fees[0].studentClass : "N/A"}</p>
            <p>ID: {fees.length > 0 ? fees[0]?.studentId : "N/A"}</p>

            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="hidden md:table-cell">Term</th>
                        <th className="hidden md:table-cell">Term Fees</th>
                        <th className="hidden md:table-cell">Paid</th>
                        <th className="hidden md:table-cell">Discount</th>
                        <th className="hidden md:table-cell">Fine</th>
                        <th className="hidden md:table-cell">Due</th>
                        <th className="hidden md:table-cell">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {fees.map((fee, index) => {
                        const isAbacus = fee.abacusFees > 0 ? fee.abacusFees + fee.amount : fee.amount;
                        const totalDue = isAbacus + fee.fine - fee.discount;
                        return (
                            <tr key={`${fee.term}-${index}`} className="border">
                                <td className="hidden md:table-cell">{fee.term}</td>
                                <td className="hidden md:table-cell">₹{isAbacus}</td>
                                <td className="hidden md:table-cell">₹{fee.paid ? fee.amount : 0}</td>
                                <td className="hidden md:table-cell">₹{fee.discount}</td>
                                <td className="hidden md:table-cell">₹{fee.fine}</td>
                                <td className="hidden md:table-cell">₹{totalDue}</td>
                                <td className="hidden md:table-cell">{fee.paid ? "Paid ✅" : "Pending ❌"}</td>
                            </tr>
                        );
                    })}
                </tbody>



            </table>
        </div>
    );
};

export default FeeCollectionPage;
