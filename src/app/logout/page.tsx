"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    // 1. Sign out
    clerk.signOut();
    // 2. Redirect to login
    router.push("/login");
  }, [clerk, router]);

  return <div>Logging out...</div>;
}
