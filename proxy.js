import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { GUEST_COOKIE, verifyGuestToken } from "./lib/guest-session.js";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Authentication endpoints and the access screen must remain reachable
  // before either sign-in method has established a session.
  if (
    pathname === "/access" ||
    pathname === "/api/auth" ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/guest-access" ||
    pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  const guestToken = request.cookies.get(GUEST_COOKIE)?.value;
  if (verifyGuestToken(guestToken)) return NextResponse.next();

  let googleToken = null;
  try {
    googleToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  } catch {
    // Invalid or expired auth cookies are treated as signed out.
  }
  if (googleToken) return NextResponse.next();

  const accessUrl = new URL("/access", request.url);
  accessUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
