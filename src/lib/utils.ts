import { auth } from "@clerk/nextjs/server";

/**
 * Fetches the user's role from Clerk's session claims using the userId.
 * @returns The user's role as a string or null if unavailable.
 */
export async function getRole(): Promise<string | null> {
  try {
    const { sessionClaims, userId } = await auth(); // Await the promise resolution and include userId

    // Log or use userId as needed
    console.log("User ID:", userId);

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
