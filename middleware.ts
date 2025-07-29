import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const isPublicRoutes = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/forgot-password",
]);

const isPublicApiRoutes = createRouteMatcher([
  "/api/webhook/register",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);
  const pathname = url.pathname;

  // --- Allow public API routes without redirect ---
  if (isPublicApiRoutes(req)) {
    return NextResponse.next();
  }

  // --- If NOT authenticated and accessing a protected route ---
  if (!userId && !isPublicRoutes(req)) {
    const redirectUrl = new URL("/sign-in", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname); // To return after login
    return NextResponse.redirect(redirectUrl);
  }

  // --- If authenticated and accessing sign-in/sign-up ---
  if (userId && isPublicRoutes(req)) {
    // If they were trying to go somewhere before, redirect back
    const redirectTo = url.searchParams.get("redirectTo") || "/"; 
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static assets and Next.js internals
    "/((?!_next|.*\\..*).*)",
    // Match API routes as well
    "/api/(.*)",
  ],
};
