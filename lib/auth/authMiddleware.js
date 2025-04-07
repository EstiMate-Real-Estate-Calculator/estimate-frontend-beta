import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// import TokenHandler from '@lib/auth/tokenHandler'; // Remove this import
import JWTHandler from '@lib/auth/jwtHandler'; // Assuming JWTHandler is Edge-compatible

/**
 * Lightweight Authentication Middleware for Edge Runtime
 * - Checks for token existence
 * - Decodes token
 * - Checks token expiry
 *
 * Database validation should happen in API routes or Server Components.
 */
export async function authMiddleware(request) {
  const cookie = cookies();
  const authToken = cookie.get('authToken')?.value;

  // If no token, redirect to login
  if (!authToken) {
    console.log('AuthMiddleware: No token found, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  try {
    // Decode the token to get the payload - Make sure JWTHandler is Edge compatible
    // If JWTHandler uses Node.js APIs, you might need a different library (like 'jose')
    const payload = JWTHandler.decodeToken(authToken); // Or use an Edge-compatible JWT library

    // Basic validation of payload structure (optional but recommended)
    if (!payload || typeof payload.userId !== 'string' || typeof payload.expires !== 'number') {
        console.error('AuthMiddleware: Invalid token payload structure');
        // Clear potentially invalid cookie
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('authToken');
        return response;
    }

    const { expires } = payload;

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (expires < currentTime) {
      console.log('AuthMiddleware: Token expired, redirecting to sign-in');
      // Clear expired cookie
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('authToken');
      return response;
    }

    // --- Database Validation Removed ---
    // The check against TokenHandler.getToken is removed because it likely uses Prisma/Node.js APIs.
    // This validation MUST now happen within your protected API routes or Server Components
    // before accessing sensitive data.

    // If basic checks pass, allow the request to proceed
    // Add user ID to headers so downstream components/routes can use it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId); // Pass user ID downstream

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

  } catch (error) {
    console.error('AuthMiddleware: Error processing token:', error.message);
    // Clear potentially invalid cookie
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete('authToken');
    return response;
  }
}