import { prisma } from '@lib/prisma';

/**
 * Handle all CRUD (Create, Read, Update, Delete) functionality for the UserTokens table
 * 
 * @example
const userId = 1; // Example user ID
const tokenString = 'myUniqueToken123';
const timeToLive = 3600; // Time to live in seconds

// Create a new token for a user
const newToken = await TokenHandler.createToken(userId, tokenString, timeToLive);
console.log('Token created:', newToken);

// Get a token based on userId
const fetchedToken = await TokenHandler.getToken(userId);
console.log('Fetched token:', fetchedToken);

// Update the token's time to live and token based on userId
const updatedToken = await TokenHandler.updateToken(userId, 'myUpdatedToken456', 7200);
console.log('Updated token:', updatedToken);

// Delete the token based on userId
const deleteResponse = await TokenHandler.deleteToken(userId);
console.log(deleteResponse);
 */
class TokenHandler {
  constructor() {}

  // Creates a new token for a user
  static async createToken(userId, token, timeToLive) {
    try {
      const newToken = await prisma.userTokens.create({
        data: {
          userId,
          token,
          time_to_live: timeToLive,
        },
      });
      return newToken;
    } catch (error) {
      throw new Error(
        `An exception occurred when creating a new token: ${error}`
      );
    }
  }

  // Gets a token based on user ID
  static async getToken(userId) {
    try {
      // Convert incoming userId (string from JWT) to an integer
      const userIdInt = parseInt(userId, 10);

      if (isNaN(userIdInt)) {
        console.error(`TokenHandler.getToken: Invalid non-numeric userId received: ${userId}`);
        return null; // Or throw an error if preferred
      }

      const userToken = await prisma.userTokens.findUnique({
        where: { userId: userIdInt }, // Use the integer ID
      });
      return userToken;
    } catch (error) {
      throw new Error(`An exception occurred when getting the token: ${error}`);
    }
  }

  // Updates a token's time to live and token based on the userId
  static async updateToken(userId, token, newTimeToLive) {
    try {
      const updatedToken = await prisma.userTokens.update({
        where: { userId: userId },
        data: {
          token: token,
          time_to_live: newTimeToLive,
        },
      });

      return updatedToken;
    } catch (error) {
      throw new Error(
        `An exception occurred when updating the token: ${error}`
      );
    }
  }

  // Deletes a token based on the userId
  static async deleteToken(userId) {
    try {
      await prisma.userTokens.delete({
        where: { userId },
      });
      return { message: 'Token deleted successfully' }; // Confirmation message
    } catch (error) {
      throw new Error(
        `An exception occurred when deleting the token: ${error}`
      );
    }
  }
}

export default TokenHandler;
