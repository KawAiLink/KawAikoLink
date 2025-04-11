import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/account/setup") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/account")) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = `redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }


    const user = token; 


    const requiredPreferenceFields = ["femboy", "sexualOrientation"];


    const missingFields = requiredPreferenceFields.filter(
      (field) => !user[field] && user[field] !== ""
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