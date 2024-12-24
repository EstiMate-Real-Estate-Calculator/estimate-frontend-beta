import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import TokenHandler from '@lib/auth/tokenHandler';
import JWTHandler from '@lib/auth/jwtHandler';

/**
 * Authentication Middleware
 */
export async function authMiddleware(request) {
  const cookie = cookies();
  const authToken = cookie.get('authToken')?.value;

  // If no token, redirect to login
  if (!authToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  try {
    // Decode the token to get the payload
    const payload = JWTHandler.decodeToken(authToken);

    const { userId, expires } = payload;

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (expires && expires < currentTime) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Validate the token against the database
    const userToken = await TokenHandler.getToken(userId);

    if (
      !userToken ||
      userToken.time_to_live < currentTime ||
      userToken.token !== authToken
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If valid, pass through
    return NextResponse.next();
  } catch (error) {
    if (
      error.message.includes(
        'PrismaClient is not configured to run in Edge Runtime'
      )
    ) {
      return null;
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
}
