import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check for both possible cookie names (auth_token from frontend, token from backend)
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;
  
  // Define authentication-protected paths
  const protectedPaths = [
    '/user-profile',
    '/user-profile/settings',
    '/dashboard'
  ];
  
  // Check if the current path is a protected path
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // If accessing a protected path without a token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}