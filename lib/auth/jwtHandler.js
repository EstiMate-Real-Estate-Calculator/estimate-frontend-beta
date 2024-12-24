import jwt from 'jsonwebtoken';

/**
 * Handles the creation, verification and decoding of JSON Web Tokens
 *
 *@example
// Sample payload and secret key
const payload = { userId: 123, username: 'exampleUser' };
const secretKey = 'your-very-secure-secret';

// Create a JWT
const token = JWTHandler.createToken(payload, secretKey);

// Verify the JWT
const verifiedPayload = JWTHandler.verifyToken(token, secretKey);

// Decode the JWT without verification
const decodedPayload = JWTHandler.decodeToken(token);

 */
class JWTHandler {
  // Method to create a JWT with a dynamic secret key
  static createToken(payload, secretKey, options = { expiresIn: '1h' }) {
    try {
      const token = jwt.sign(payload, secretKey, options);
      return token;
    } catch (error) {
      throw new Error(`An error occurred while creating the token: ${error}`);
    }
  }

  // Method to verify a JWT with a dynamic secret key
  static verifyToken(token, secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      throw new Error(`An error occurred while verifying the token: ${error}`);
    }
  }

  // Method to decode a JWT without verifying
  static decodeToken(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded; // Returns payload without verification
    } catch (error) {
      throw new Error(`An error occurred while decoding the token: ${error}`);
    }
  }
}

export default JWTHandler;
