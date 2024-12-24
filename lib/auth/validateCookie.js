import { cookies } from 'next/headers';
import TokenHandler from '@lib/auth/tokenHandler';
import JWTHandler from '@lib/auth/jwtHandler';

export default async function validateCookie() {
  const authToken = cookies().get('authToken')?.value;

  // If no token, return null
  if (!authToken) {
    return null;
  }

  try {
    // Decode the token to get the payload
    const payload = JWTHandler.decodeToken(authToken);
    const { userId, expires } = payload;

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (expires && expires < currentTime) {
      return null;
    }

    // Validate the token against the database
    const userToken = await TokenHandler.getToken(userId);

    if (
      !userToken ||
      userToken.time_to_live < currentTime ||
      userToken.token !== authToken
    ) {
      return null;
    }

    // If valid, return the payload
    return payload;
  } catch (error) {
    if (
      error.message.includes(
        'PrismaClient is not configured to run in Edge Runtime'
      )
    ) {
      // Do nothing
    } else {
      return null;
    }
  }
}
