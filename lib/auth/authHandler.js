import UserHandler from '@lib/auth/userHandler';
import TokenHandler from '@lib/auth/tokenHandler';
import JWTHandler from '@lib/auth/jwtHandler';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

/**
 * Handles Authentication - used within API
 *
 * @example
 *
 * // Logging in
 * const { email, password, username } = await request.json();
 * const response = await AuthHandler.logIn({ email, password, username });
 * return NextResponse.json(response, { status: 200 });
 *
 * // Signing out
 * const { userId } = await request.json();
 * const response = await AuthHandler.logOut(userId);
 * return NextResponse.json(response, { status: 200 });
 */
class AuthHandler {
  constructor() {}

  // Logs a user in
  static async logIn({ email, password, username }) {
    try {
      // Verify user credentials
      let user;

      if (username) {
        user = await UserHandler.getUserByUsername(username);
      } else {
        user = await UserHandler.getUserByEmail(email);
      }

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Create JWT
      const payload = {
        userId: user.id.toString(),
        username: user.username,
        email: user.email,
        expires: Math.floor(Date.now() / 1000 + 3600),
      };

      const authToken = JWTHandler.createToken(payload, user.privateKey); // Create JWT using users unique private key

      // Check if a token already exists for the user
      const existingToken = await TokenHandler.getToken(user.id);

      if (existingToken) {
        // Update the existing token
        await TokenHandler.updateToken(
          user.id,
          authToken,
          Math.floor(Date.now() / 1000 + 3600)
        );
      } else {
        // Save new token in the database
        await TokenHandler.createToken(
          user.id,
          authToken,
          Math.floor(Date.now() / 1000 + 3600)
        );
      }

      // Set authToken as httpOnly cookie
      const cookie = cookies();
      cookie.set('authToken', authToken, {
        httpOnly: true,
        path: '/',
        maxAge: 3600,
      });

      return {
        message: 'Login successful',
        accessToken: authToken,
        userid: user.id,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Logs a user out
  static async logOut(userId) {
    try {
      // Clear authToken cookie
      const cookie = cookies();
      cookie.delete('authToken', { path: '/' });

      // Remove authToken from token table in the database
      await TokenHandler.deleteToken(userId);

      return { message: 'Logout successful' };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }
}

export default AuthHandler;
