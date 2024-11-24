import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// Create matchers for all routes in the access map
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

export default clerkMiddleware(async (auth, req) => {
  // Resolve the authentication object
  const authObject = await auth();
  const sessionClaims = authObject.sessionClaims;

  // Extract role from session claims metadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Check each matcher to see if the route matches and if the role is allowed
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // If the role is not allowed, redirect
      if (!allowedRoles.includes(role!)) {
        const redirectPath = `/${role}`;
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      break; // Stop checking other matchers if one matches
    }
  }

  // If no matching route or role restrictions, continue to the next middleware
  return NextResponse.next();
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
