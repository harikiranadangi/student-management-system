import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "@/lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  try {
    const { sessionClaims } = await auth();

    const role = (sessionClaims?.metadata as { role?: string })?.role;

    // 🛡️ If no role exists, redirect to /unauthorized once
    if (!role) {
      const url = new URL(req.url);
      if (url.pathname !== "/unauthorized") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next(); // prevent infinite loop
    }

    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        const redirectUrl = new URL(`/${role}`, req.url);
        if (req.nextUrl.pathname !== redirectUrl.pathname) {
          return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next(); // avoid loop
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|api|static|.*\\..*|unauthorized).*)",
    "/api/(.*)",
  ],
};
