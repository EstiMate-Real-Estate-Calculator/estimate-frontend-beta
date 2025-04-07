import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Handle all CRUD (Create, Read, Update, Delete) functionality for the users table
 *
 * @example
 * // Create a new user
 * const newUser = await UserHandler.createUser({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123',
 * });
 * console.log('User created:', newUser);
 *
 * // Get all users
 * const users = await UserHandler.getAllUsers();
 * console.log('All users:', users);
 *
 * // Get a user by ID
 * const userById = await UserHandler.getUserById(newUser.id);
 * console.log('User found by ID:', userById);
 *
 * // Get a user by email
 * const userByEmail = await UserHandler.getUserByEmail('john@example.com');
 * console.log('User found by email:', userByEmail);
 *
 * // Get a user by username
 * const userByUsername = await UserHandler.getUserByUsername('john_doe');
 * console.log('User found by username:', userByUsername);
 *
 * // Update user data
 * const updatedUser = await UserHandler.updateUser(newUser.id, {
 *   email: 'john.doe@example.com',
 * });
 * console.log('User updated:', updatedUser);
 *
 * // Delete the user
 * const deleteResponse = await UserHandler.deleteUser(newUser.id);
 * console.log(deleteResponse);
 */
class UserHandler {
  /**
   * Creates a new user with the provided data.
   * @param {Object} user - The user data containing username, email, and password.
   * @returns {Promise<Object>} The newly created user object.
   */
  static async createUser(user) {
    try {
      const { username, email, password } = user;

      // Basic input validation
      if (!username || !email || !password) {
        throw new Error("Username, email, and password are required.");
      }

      // Salt and hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a random private key and a unique token
      const privateKey = crypto.randomBytes(64).toString("hex");
      const uniqueToken = crypto.randomBytes(64).toString("hex");
      const tutorials = [1];

      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          privateKey,
          uniqueToken,
          tutorials
        },
      });

      return newUser;
    } catch (error) {
      throw new Error(`An exception occurred when creating a new user: ${error}`);
    }
  }

  /**
   * Retrieves all user IDs from the database.
   * @returns {Promise<Array>} An array of user IDs.
   */
  static async getAllUserIds() {
    try {
      const users = await prisma.users.findMany({ select: { id: true } });
      return users.map((user) => user.id);
    } catch (error) {
      throw new Error(`An exception occurred when retrieving all user IDs: ${error}`);
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<Array|Object>} An array of user objects or an error message if no users found.
   */
  static async getAllUsers() {
    try {
      const users = await prisma.users.findMany();
      if (!users || users.length === 0) {
        return { error: true, message: "No users found" };
      }
      return users;
    } catch (error) {
      throw new Error(`An exception occurred when retrieving all users: ${error}`);
    }
  }

  /**
   * Retrieves a user's data based on the user ID.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Object>} The user object, or an error message if not found.
   */
  static async getUserById(userId) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { error: true, message: "User not found" };
      }

      return user;
    } catch (error) {
      throw new Error(`An exception occurred when getting a user: ${error}`);
    }
  }

  /**
   * Retrieves a user's data based on their email.
   * @param {string} email - The email of the user.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   */
  static async getUserByEmail(email) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new Error(`An exception occurred when getting a user by email: ${error}`);
    }
  }

  /**
   * Retrieves a user's data based on their username.
   * @param {string} username - The username of the user.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   */
  static async getUserByUsername(username) {
    try {
      const user = await prisma.users.findUnique({
        where: { username },
      });

      return user;
    } catch (error) {
      throw new Error(`An exception occurred when getting a user by username: ${error}`);
    }
  }

  /**
   * Updates a user's data based on the user ID and provided data.
   * @param {string} userId - The unique identifier of the user.
   * @param {Object} userData - The updated data for the user.
   * @returns {Promise<Object>} The updated user object.
   */
  static async updateUser(userId, userData) {
    try {
      const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: userData,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`An exception occurred when updating a user: ${error}`);
    }
  }

  /**
   * Deletes a user based on the user ID.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Object>} Confirmation message upon successful deletion.
   */
  static async deleteUser(userId) {
    try {
      await prisma.users.delete({
        where: { id: userId },
      });
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new Error(`An exception occurred when deleting a user: ${error}`);
    }
  }
}

export default UserHandler;
