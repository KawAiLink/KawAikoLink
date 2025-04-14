import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow access to /account/setup without authentication
  if (pathname === "/account/setup") {
    return NextResponse.next();
  }

  // Protect routes under /account
  if (pathname.startsWith("/account")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token);

    // Redirect to login if token is missing or invalid
    if (!token || typeof token !== "object") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = `redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};