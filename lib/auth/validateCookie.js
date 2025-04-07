import { cookies } from 'next/headers';
import TokenHandler from '@lib/auth/tokenHandler';
import JWTHandler from '@lib/auth/jwtHandler';

export default async function validateCookie() {
  console.log("validateCookie: Attempting to validate..."); // Log start
  const authToken = cookies().get('authToken')?.value;

  // If no token, return null
  if (!authToken) {
    console.log("validateCookie: No authToken cookie found."); // Log no cookie
    return null;
  }

  try {
    // Decode the token to get the payload
    console.log("validateCookie: Decoding token...");
    const payload = JWTHandler.decodeToken(authToken);
    console.log("validateCookie: Decoded payload:", payload);
    const { userId, expires } = payload;

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    console.log(`validateCookie: Current time: ${currentTime}, Token expires: ${expires}`);

    if (expires && expires < currentTime) {
      console.log("validateCookie: JWT token is expired."); // Log JWT expired
      return null;
    }

    // Validate the token against the database
    console.log(`validateCookie: Fetching DB token for userId: ${userId}`);
    const userToken = await TokenHandler.getToken(userId);
    console.log("validateCookie: DB token result:", userToken);

    if (!userToken) {
      console.log("validateCookie: No token found in DB for user."); // Log DB token not found
      return null;
    }

    console.log(`validateCookie: DB token TTL: ${userToken.time_to_live}`);
    if (userToken.time_to_live < currentTime) {
      console.log("validateCookie: DB token is expired (TTL)."); // Log DB token TTL expired
      return null;
    }

    // Compare cookie token with DB token
    console.log("validateCookie: Comparing cookie token with DB token...");
    if (userToken.token !== authToken) {
        console.log("validateCookie: Cookie token does not match DB token."); // Log token mismatch
        // Optionally log the tokens for debugging (be careful with logging sensitive data)
        // console.log("Cookie Token:", authToken);
        // console.log("DB Token:", userToken.token);
        return null;
    }

    // If valid, return the payload
    console.log("validateCookie: Validation successful."); // Log success
    return payload;
  } catch (error) {
    console.error("validateCookie: Error during validation:", error); // Log caught error
    if (
      error.message.includes(
        'PrismaClient is not configured to run in Edge Runtime'
      )
    ) {
      // Do nothing
      console.log("validateCookie: Caught Prisma Edge Runtime error, ignoring.");
    } else {
      return null;
    }
  }
}
