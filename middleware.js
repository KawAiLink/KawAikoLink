import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {

	const pathname = req.nextUrl.pathname;

	if (pathname.startsWith("/account")) {

		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


		if (!token) {
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