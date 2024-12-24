import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Handle all CRUD (Create, Read, Update, Delete) functionality for the users table
 * 
 * @example
 * // Create a new user
const newUser = await UserHandler.createUser({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123',
});
console.log('User created:', newUser);

// Get a user by ID
const userById = await UserHandler.getUserById(newUser.id);
console.log('User found by ID:', userById);

// Get a user by email
const userByEmail = await UserHandler.getUserByEmail('john@example.com');
console.log('User found by email:', userByEmail);

// Get a user by username
const userByUsername = await UserHandler.getUserByUsername('john_doe');
console.log('User found by username:', userByUsername);

// Update user data
const updatedUser = await UserHandler.updateUser(newUser.id, {
    email: 'john.doe@example.com', // Change the email
});
console.log('User updated:', updatedUser);

// Delete the user
const deleteResponse = await UserHandler.deleteUser(newUser.id);
console.log(deleteResponse);
 */
class UserHandler {
  constructor() {}

  // Creates a new user based requires object param containing username, email, and password.
  static async createUser(user) {
    try {
      const { username, email, password } = user;

      // Salt and hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a random private key to be used as JWT secret
      const privateKey = crypto.randomBytes(64).toString('hex');
      const uniqueToken = crypto.randomBytes(64).toString('hex'); // Need to verify this it was in original schema but its use is unknown

      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          privateKey: privateKey,
          uniqueToken: uniqueToken,
        },
      });

      return newUser;
    } catch (error) {
      throw new Error(
        `An exception occured when creating a new user: ${error}`
      );
    }
  }

  // Gets a user's data based on the id
  static async getUserById(userId) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { error: true, message: 'User not found' };
      }

      return user;
    } catch (error) {
      throw new Error(`An exception occurred when getting a user: ${error}`);
    }
  }

  // Gets a user's data based on the email
  static async getUserByEmail(email) {
    try {
      const user = await prisma.users.findUnique({
        where: { email: email },
      });


      return user;
    } catch (error) {
      throw new Error(`An exception occurred when getting a user: ${error}`);
    }
  }

  // Gets a user's data based on the username
  static async getUserByUsername(username) {
    try {
      const user = await prisma.users.findUnique({
        where: { username: username },
      });

      return user;
    } catch (error) {
      throw new Error(`An exception occurred when getting a user: ${error}`);
    }
  }

  // Updates a user's data based on the id and desired updated data
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

  // Deletes a user based on the id
  static async deleteUser(userId) {
    try {
      await prisma.users.delete({
        where: { id: userId },
      });
      return { message: 'User deleted successfully' }; // Confirmation message
    } catch (error) {
      throw new Error(`An exception occurred when deleting a user: ${error}`);
    }
  }
}

export default UserHandler;
