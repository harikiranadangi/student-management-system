"use client";

import { useState, useEffect } from "react";

type Profile = {
    id: string;
    role: string;
};

type Props = {
    profiles: Profile[];
    activeProfileId: string;
};

export default function ProfileSwitcher({ profiles, activeProfileId }: Props) {
    const [selectedProfileId, setSelectedProfileId] = useState(activeProfileId);

    useEffect(() => {
        setSelectedProfileId(activeProfileId);
    }, [activeProfileId]);

    const handleSwitch = async (profileId: string) => {
        setSelectedProfileId(profileId);

        await fetch("/api/set-active-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileId }),
        });

        // Optional: refresh page after switching
        window.location.reload();
    };

    return (
        <div className="flex gap-2 mt-2">
            {profiles.map((p: Profile) => (
                <button
                    key={p.id}
                    onClick={() => handleSwitch(p.id)}
                    className={`px-3 py-1 rounded-md ${selectedProfileId === p.id ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                >
                    {p.role}
                </button>
            ))}

        </div>
    );
}
