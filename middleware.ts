import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simply allow all requests through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    '/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|css|js|ts|json|map|woff2?|ttf|eot|mp4|webm|pdf|txt)).*)',
    // Always run on API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};
