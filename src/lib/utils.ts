// utils.ts
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server"; // Correct import

// Extract the role from Clerk authentication session claims
export const getRoleFromAuth = async (req: NextRequest) => {
  const { sessionClaims } = await getAuth(req);
  
  // Extract role from session claims metadata
  return (sessionClaims?.metadata as { role?: string })?.role;
};
