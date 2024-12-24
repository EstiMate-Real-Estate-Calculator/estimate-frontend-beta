import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth/authMiddleware';

// Global middleware
export function middleware(request) {
  // Apply global logic
  console.log(`Request made to ${request.url}`);

  // Apply auth middleware to specific routes
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/report')
  ) {
    return authMiddleware(request);
  }

  return NextResponse.next();
}

// Apply global middleware to all routes
export const config = {
  matcher: ['/', '/dashboard', '/report/:path*'],
};
