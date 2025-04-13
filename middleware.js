import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Allow access to /account/setup without authentication
  if (pathname === "/account/setup") {
    return NextResponse.next();
  }

  // Protect routes under /account
  if (pathname.startsWith("/account")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Redirect to login if token is missing or invalid
    if (!token || typeof token !== "object") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = `redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    // Check for missing preference fields
    const requiredPreferenceFields = ["femboy", "sexualOrientation"];
    const missingFields = requiredPreferenceFields.filter(
      (field) => !(field in token) || token[field] === null || token[field] === ""
    );

    if (missingFields.length > 0) {
      const url = req.nextUrl.clone();
      url.pathname = "/account/setup";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};