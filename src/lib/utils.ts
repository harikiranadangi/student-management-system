import { auth } from "@clerk/nextjs/server";

/**
 * Fetches the user's role from Clerk's session claims.
 * @returns The user's role as a string or null if unavailable.
 */
export async function getRole(): Promise<string | null> {
  const { userId, sessionClaims } = await auth();

  // Ensure that if role is undefined, it returns null instead
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return role ?? null; // If role is undefined, return null
}
