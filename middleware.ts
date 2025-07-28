import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export const isPublicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/api/webhook/register",
];



export default clerkMiddleware(async (auth, req) => {

  const { userId } = await auth();
  const url = req.nextUrl.clone();

  const isPublic = isPublicRoutes.some((route) => url.pathname.startsWith(route));


  // If user is logged in
  if (userId) {
    // Prevent access to public routes
    if (isPublic && !url.pathname.startsWith("/api")) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If user is NOT logged in
  if (!isPublic) {
    url.pathname = "/sign-up";
    return NextResponse.redirect(url);
  }

  // Allow access to public routes
  return NextResponse.next();
});



export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Protect all pages except static assets & Next internals
  ],
};