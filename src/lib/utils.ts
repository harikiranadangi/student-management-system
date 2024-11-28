import { auth } from "@clerk/nextjs/server";

/**
 * Fetches the user's role from Clerk's session claims.
 * @returns The user's role as a string or null if unavailable.
 */
export async function getRole(): Promise<string | null> {
  try {
    const { sessionClaims } = await auth(); // Await the promise resolution

    // Define the expected shape of session metadata
    interface SessionMetadata {
      role?: string;
    }

    // Safely access the role
    return (sessionClaims?.metadata as SessionMetadata)?.role || null;
  } catch (error) {
    console.error("Failed to fetch role:", error);
    return null;
  }
}
