import { auth } from "@clerk/nextjs/server";

/**
 * Fetches the user's role from Clerk's session claims.
 * @returns The user's role as a string or null if unavailable.
 */
export async function getRole(): Promise<string | null> {
  try {
    const { userId, sessionClaims } = await auth();

    // Log the userId if necessary
    console.log("User ID:", userId);

    // Define the expected shape of session metadata
    interface SessionMetadata {
      role?: string;
    }

    // Extract and return the role, defaulting to null if undefined
    const role = (sessionClaims?.metadata as SessionMetadata)?.role;
    return role ?? null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}
