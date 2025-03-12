import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "@/lib/settings";
import { NextResponse } from "next/server";

// * Create matchers for all routes in the access map
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

// * Middleware
// This middleware will run on every request
export default clerkMiddleware(async (auth, req) => {
  
  // * Get session claims and ID
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role

  // * Check if user is allowed to access the route
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});



// * Middleware configuration
export const config = {
  matcher: [
    "/((?!_next|api|static|.*\\..*).*)", // Apply to all pages except Next.js internals and static files
    "/api/(.*)", // Ensure it runs on API routes
  ],
};



