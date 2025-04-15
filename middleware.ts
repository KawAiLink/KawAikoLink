import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ['/auth/login', '/auth/register', '/api/auth'];
  const isPublicPath = publicPaths.some(p => path.startsWith(p));
  if (isPublicPath) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL('/auth/login', request.url));

  if (!token.preferences && !path.startsWith('/account/setup') && !path.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/account/setup', request.url));
  }

  const datePaths = ['/chat'];
  const isDatePath = datePaths.some(p => path.startsWith(p));
  if (isDatePath && token.dateEnabled === false) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// cleaned up structure, removed redundant comments and made it cuter (๑˃̵ᴗ˂̵)
