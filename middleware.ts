import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isPublicRoute, REDIRECTS } from "./utils/routeUtils";



export default clerkMiddleware(async (auth, req) => {

  const { userId } = await auth();
  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    // ✅ 0. Skip middleware for the webhook endpoint (important for server-to-server calls)
    if (pathname === "/api/webhook/register") {
      return NextResponse.next();
    }


    // 1️⃣ Not logged in & route is protected → Redirect to /sign-in
    if (!userId && !isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL(REDIRECTS.UNAUTHENTICATED, req.url));
    }


    // 2️⃣ Logged in:
    if (userId) {
      // Accessing root "/" → redirect to /home
      if (pathname === "/") {
        return NextResponse.redirect(new URL(REDIRECTS.AUTHENTICATED, req.url));
      }

      // Accessing sign-in, sign-up, or forgot-password → redirect to /home
      if (REDIRECTS.AUTH_FORBIDDEN.includes(pathname)) {
        return NextResponse.redirect(new URL(REDIRECTS.AUTHENTICATED, req.url));
      }
    }



    // ✅ Allow normal flow
    return NextResponse.next();

  } catch (error) {
    console.error("❌ Middleware error: ", error);
    // Avoid showing sensitive info, redirect to error page
    return NextResponse.redirect(new URL(REDIRECTS.ERROR, req.url));
  }
});



export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|api/webhook/register).*)",
    "/api/(.*)"
  ]
};