import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// Create matchers for all routes in the access map
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log("Generated Matchers:", matchers);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Resolve the authentication object
    const authObject = await auth();
    const sessionClaims = authObject.sessionClaims;

    // Extract role from session claims metadata
    const role = (sessionClaims?.metadata as { role?: string })?.role || "guest";

    console.log("User Role:", role);

    // Check each matcher to see if the route matches and if the role is allowed
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req)) {
        console.log("Matched Route:", req.url);

        // If the role is not allowed, redirect
        if (!allowedRoles.includes(role)) {
          const redirectPath = `/${role}`;
          console.log(`Unauthorized access. Redirecting to: ${redirectPath}`);
          return NextResponse.redirect(new URL(redirectPath, req.url));
        }
        break; // Stop checking other matchers if one matches
      }
    }

    // If no matching route or role restrictions, continue to the next middleware
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    // Handle unexpected errors by redirecting to a generic error or login page
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
