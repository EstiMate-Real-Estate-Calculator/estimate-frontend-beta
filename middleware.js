import { NextResponse } from 'next/server';
// Ensure the path alias resolves correctly OR use a relative path if needed
import { authMiddleware } from '@lib/auth/authMiddleware';

// Global middleware
export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware: Request to ${request.url}`);

  // Apply auth middleware to specific protected routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/report') // Assuming /report is also protected
    // Add other protected paths here
  ) {
    console.log(`Middleware: Applying authMiddleware to ${pathname}`);
    // Chain the authMiddleware
    return authMiddleware(request); // This will redirect if auth fails basic checks
  }

  // For public routes, just continue
  console.log(`Middleware: Allowing public access to ${pathname}`);
  return NextResponse.next();
}

// Apply middleware to specified routes
export const config = {
  // Matcher defines routes where the *entire* middleware function runs
  // Update this to include all paths you want the middleware logic (console logs, auth checks) to apply to.
  // Use more specific paths if possible. Avoid overly broad matchers like '/:path*'.
   matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in / sign-up (authentication pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)',
    // Explicitly include protected base paths if needed, though the above should cover them
    // '/dashboard/:path*',
    // '/report/:path*',
  ],
};