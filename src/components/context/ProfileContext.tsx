"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// 🔹 Define Role type
export type Role = {
  id: number;
  role: string;
  username: string;
  profileId: string;
};

// 🔹 Define Profile type
export type Profile = {
  id: string;
  phone: string;
  clerk_id: string;
  activeUserId: number;
  roles: Role[];
  activeRole?: Role;
};

// 🔹 Define Context shape
type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  switchRole: (roleId: number) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Switch role
  async function switchRole(roleId: number) {
    setLoading(true);
    await fetch("/api/switch-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId }),
    });
    const res = await fetch("/api/profile");
    const data = await res.json();
    setProfile(data);
    setLoading(false);
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, switchRole }}>
      {children}
    </ProfileContext.Provider>
  );
}

// 🔹 Custom hook
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
