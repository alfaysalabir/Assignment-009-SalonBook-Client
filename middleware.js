import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Quick check: no session cookie -> go to Sign In. (Real role checks happen in the dashboard layouts AND on the server API.)
export function middleware(request) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:id", "/payment/:path*"],
};
