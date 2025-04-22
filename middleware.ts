import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Try to get token from Authorization header (e.g., Bearer <token>)
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // 2. Define routes that require authentication
  const protectedPaths = [
    '/user-profile',
    '/user-profile/settings',
    '/dashboard',
  ];

  // 3. Check if the current path is protected
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 4. Redirect unauthenticated users trying to access protected paths
  if (isProtected && !token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Continue to next middleware or route
  return NextResponse.next();
}

// Match all routes except Next.js internals & static files
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|css|js|ts|json|map|woff2?|ttf|eot|mp4|webm|pdf|txt)).*)',
    '/(api|trpc)(.*)',
  ],
};
