"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    const signOutAndRedirect = async () => {
      try {
        // 1. Sign out
        await clerk.signOut();
        // 2. Redirect to login
        router.push("/login");
      } catch (err) {
        console.error("Error signing out:", err);
      }
    };

    signOutAndRedirect();
  }, [clerk, router]);

  return <div>Logging out...</div>;
}
